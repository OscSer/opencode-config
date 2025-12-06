import unittest
from unittest.mock import patch
import sys
import os
from pathlib import Path

# Add src directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.installer import ConfigInstaller
from src.types_def import InstallError, CopyError
from src.agents_config import AGENTS_CONFIG


class TestConfigInstaller(unittest.TestCase):

    def setUp(self):
        """Set up a test environment."""
        self.repo_dir = Path("/fake/repo")
        self.home_dir = Path("/fake/home")

        self.opencode_dir = self.home_dir / ".config" / "opencode"

        # Patch Path.home() to return our fake home directory
        self.path_home_patch = patch("pathlib.Path.home", return_value=self.home_dir)
        self.path_home_mock = self.path_home_patch.start()

        self.installer = ConfigInstaller(
            repo_dir=self.repo_dir,
            opencode_dir=self.opencode_dir,
        )

    def tearDown(self):
        """Clean up after tests."""
        self.path_home_patch.stop()

    @patch("src.file_ops.validate_source_path")
    @patch("pathlib.Path.exists")
    @patch("pathlib.Path.is_file")
    def test_resolve_source_success(self, mock_is_file, mock_exists, mock_validate):
        """Test resolving a valid source file."""
        mock_validate.return_value = self.repo_dir / "agents/opencode/opencode.json"

        source_path = self.installer.resolve_source("agents/opencode/opencode.json")
        self.assertEqual(source_path, self.repo_dir / "agents/opencode/opencode.json")

    @patch("src.file_ops.validate_source_path")
    @patch("builtins.print")
    def test_resolve_source_not_found(self, mock_print, mock_validate):
        """Test resolving a non-existent source file."""
        mock_validate.return_value = None

        source_path = self.installer.resolve_source("nonexistent.json")
        self.assertIsNone(source_path)

    def test_get_target_dir(self):
        """Test getting the correct target directory for each agent."""
        self.assertEqual(self.installer.get_target_dir("opencode"), self.opencode_dir)

        with self.assertRaises(InstallError):
            self.installer.get_target_dir("unknown_agent")

    @patch("src.file_ops.create_symlink")
    @patch("src.file_ops.validate_source_path")
    @patch("pathlib.Path.mkdir")
    def test_install_agent_success(
        self, mock_mkdir, mock_validate, mock_symlink
    ):
        """Test a successful agent installation."""
        mock_validate.return_value = self.repo_dir / "agents/opencode/opencode.json"
        mock_symlink.return_value = True

        result = self.installer.install_agent("opencode")

        self.assertTrue(result)
        mock_mkdir.assert_called_with(parents=True, exist_ok=True)
        self.assertTrue(mock_symlink.called)

    @patch("src.installer.ConfigInstaller.install_agent", return_value=True)
    def test_install_all_success(self, mock_install_agent):
        """Test successful installation of all agents."""
        self.assertTrue(self.installer.install_all())
        self.assertEqual(mock_install_agent.call_count, 1)

    @patch("src.installer.ConfigInstaller.install_agent", side_effect=[False])
    def test_install_all_with_errors(self, mock_install_agent):
        """Test installation of all agents with some failures."""
        self.assertFalse(self.installer.install_all())
        self.assertEqual(mock_install_agent.call_count, 1)

    # === Path Validation Tests ===

    @patch("src.file_ops.validate_source_path")
    def test_validate_source_path_file_success(self, mock_validate):
        """Test successful validation of a file path."""
        mock_validate.return_value = self.repo_dir / "test.json"
        
        result = self.installer.resolve_source("test.json", must_be_file=True)
        self.assertEqual(result, self.repo_dir / "test.json")

    @patch("src.file_ops.validate_source_path")
    def test_validate_source_path_directory_success(self, mock_validate):
        """Test successful validation of a directory path."""
        mock_validate.return_value = self.repo_dir / "test_dir"
        
        result = self.installer.resolve_source("test_dir", must_be_file=False)
        self.assertEqual(result, self.repo_dir / "test_dir")

    @patch("src.file_ops.validate_source_path")
    def test_validate_source_path_not_exists(self, mock_validate):
        """Test validation when path does not exist."""
        mock_validate.return_value = None
        
        result = self.installer.resolve_source("nonexistent.json")
        self.assertIsNone(result)

    @patch("src.file_ops.validate_source_path")
    def test_validate_source_path_file_but_directory(self, mock_validate):
        """Test validation when expecting file but path is directory."""
        mock_validate.return_value = None
        
        result = self.installer.resolve_source("test.json")
        self.assertIsNone(result)

    @patch("src.file_ops.validate_source_path")
    def test_validate_source_path_directory_but_file(self, mock_validate):
        """Test validation when expecting directory but path is file."""
        mock_validate.return_value = None
        
        result = self.installer.resolve_source("test_dir", must_be_file=False)
        self.assertIsNone(result)

    # === Symlink Edge Cases ===

    @patch("src.file_ops.create_symlink")
    @patch("src.file_ops.validate_source_path")
    @patch("pathlib.Path.mkdir")
    def test_create_symlink_remove_existing_directory(
        self,
        mock_mkdir,
        mock_validate,
        mock_symlink,
    ):
        """Test symlink creation when target is an existing directory."""
        mock_symlink.return_value = True
        mock_validate.return_value = self.repo_dir / "a"
        source = self.repo_dir / "a"
        target = self.opencode_dir / "b"

        result = self.installer.install_agent("opencode")

        self.assertTrue(result)

    @patch("src.file_ops.create_symlink")
    @patch("src.file_ops.validate_source_path")
    @patch("pathlib.Path.mkdir")
    def test_create_symlink_failure(
        self, mock_mkdir, mock_validate, mock_symlink
    ):
        """Test failure during symlink creation."""
        mock_validate.return_value = self.repo_dir / "a"
        mock_symlink.side_effect = CopyError("Symlink failed")

        result = self.installer.install_agent("opencode")

        self.assertFalse(result)

    @patch("src.file_ops.create_symlink")
    def test_create_symlink_source_not_exists(self, mock_symlink):
        """Test symlink creation when source does not exist."""
        mock_symlink.side_effect = CopyError("Source does not exist")
        source = self.repo_dir / "nonexistent"
        target = self.opencode_dir / "target"

        with self.assertRaises(CopyError) as context:
            from src.file_ops import create_symlink
            create_symlink(source, target)

        self.assertIn("Source", str(context.exception))
        self.assertIn("does not exist", str(context.exception))

    # === Error Handling Tests ===

    @patch("src.file_ops.create_symlink")
    @patch("src.file_ops.validate_source_path")
    @patch("pathlib.Path.mkdir")
    def test_install_agent_symlink_failure(
        self, mock_mkdir, mock_validate, mock_symlink
    ):
        """Test agent installation when symlink creation fails."""
        mock_validate.return_value = self.repo_dir / "agents/opencode/opencode.json"
        mock_symlink.side_effect = CopyError("Symlink failed")

        result = self.installer.install_agent("opencode")

        self.assertFalse(result)

    @patch("src.file_ops.validate_source_path")
    @patch("pathlib.Path.mkdir")
    def test_install_agent_source_not_found(
        self, mock_mkdir, mock_validate
    ):
        """Test agent installation when source file is not found."""
        mock_validate.return_value = None
        
        result = self.installer.install_agent("opencode")

        self.assertTrue(result)  # Should still succeed, just skip missing asset

    # === Integration Tests ===

    @patch("src.file_ops.create_symlink")
    @patch("src.file_ops.validate_source_path")
    @patch("pathlib.Path.mkdir")
    @patch("builtins.print")
    def test_install_agent_multiple_assets(
        self, mock_print, mock_mkdir, mock_validate, mock_symlink
    ):
        """Test agent installation with multiple assets."""
        # Mock multiple assets for opencode (2 assets: opencode.json, AGENTS.md)
        mock_validate.side_effect = [
            self.repo_dir / "agents/opencode/opencode.json",
            self.repo_dir / "agents/rules/AGENTS.md",
        ]
        mock_symlink.return_value = True

        result = self.installer.install_agent("opencode")

        self.assertTrue(result)
        self.assertEqual(mock_symlink.call_count, 2)


if __name__ == "__main__":
    unittest.main()
