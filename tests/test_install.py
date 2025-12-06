import unittest
from unittest.mock import patch
import sys
import os
from pathlib import Path

# Add root directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from install import ConfigInstaller, InstallError, CopyError


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

    @patch("pathlib.Path.exists")
    @patch("pathlib.Path.is_file")
    def test_resolve_source_success(self, mock_is_file, mock_exists):
        """Test resolving a valid source file."""
        mock_exists.return_value = True
        mock_is_file.return_value = True

        source_path = self.installer.resolve_source("opencode/opencode.json")
        self.assertEqual(source_path, self.repo_dir / "opencode/opencode.json")

    @patch("builtins.print")
    @patch("pathlib.Path.exists")
    def test_resolve_source_not_found(self, mock_exists, mock_print):
        """Test resolving a non-existent source file."""
        mock_exists.return_value = False

        source_path = self.installer.resolve_source("nonexistent.json")
        self.assertIsNone(source_path)
        mock_print.assert_called_with(
            "Warning: nonexistent.json not found in repository, skipping..."
        )

    def test_get_target_dir(self):
        """Test getting the correct target directory for each agent."""
        self.assertEqual(self.installer.get_target_dir("opencode"), self.opencode_dir)

        with self.assertRaises(InstallError):
            self.installer.get_target_dir("unknown_agent")

    @patch("os.symlink")
    @patch("pathlib.Path.exists", return_value=True)
    @patch("pathlib.Path.is_symlink", return_value=False)
    @patch("pathlib.Path.unlink")
    @patch("pathlib.Path.mkdir")
    def test_create_symlink_success(
        self, mock_mkdir, mock_unlink, mock_is_symlink, mock_exists, mock_symlink
    ):
        """Test successful creation of a symlink."""
        source = self.repo_dir / "a"
        target = self.opencode_dir / "b"

        self.assertTrue(self.installer.create_symlink(source, target))
        mock_mkdir.assert_called_once_with(parents=True, exist_ok=True)
        mock_symlink.assert_called_once_with(str(source), str(target))

    @patch("os.symlink", side_effect=OSError("Permission denied"))
    @patch("pathlib.Path.exists", return_value=True)
    @patch("pathlib.Path.is_symlink", return_value=False)
    @patch("pathlib.Path.unlink")
    @patch("pathlib.Path.mkdir")
    def test_create_symlink_failure(
        self, mock_mkdir, mock_unlink, mock_is_symlink, mock_exists, mock_symlink
    ):
        """Test failure during symlink creation."""
        source = self.repo_dir / "a"
        target = self.opencode_dir / "b"

        with self.assertRaises(CopyError):
            self.installer.create_symlink(source, target)

    @patch("install.ConfigInstaller.resolve_source")
    @patch("install.ConfigInstaller.create_symlink")
    @patch("install.ConfigInstaller._run_special_actions")
    @patch("pathlib.Path.mkdir")
    def test_install_agent_success(
        self, mock_mkdir, mock_special_actions, mock_symlink, mock_resolve
    ):
        """Test a successful agent installation."""
        mock_resolve.return_value = self.repo_dir / "opencode/opencode.json"

        result = self.installer.install_agent("opencode")

        self.assertTrue(result)
        mock_mkdir.assert_called_with(parents=True, exist_ok=True)
        self.assertTrue(mock_symlink.called)
        mock_special_actions.assert_called_once_with("opencode")

    @patch("install.ConfigInstaller.install_agent", return_value=True)
    def test_install_all_success(self, mock_install_agent):
        """Test successful installation of all agents."""
        self.assertTrue(self.installer.install_all())
        self.assertEqual(mock_install_agent.call_count, 1)

    @patch("install.ConfigInstaller.install_agent", side_effect=[False])
    def test_install_all_with_errors(self, mock_install_agent):
        """Test installation of all agents with some failures."""
        self.assertFalse(self.installer.install_all())
        self.assertEqual(mock_install_agent.call_count, 1)

    # === Path Validation Tests (HIGH PRIORITY) ===

    @patch("pathlib.Path.exists", return_value=True)
    @patch("pathlib.Path.is_file", return_value=True)
    def test_validate_source_path_file_success(self, mock_is_file, mock_exists):
        """Test successful validation of a file path."""
        result = self.installer._validate_source_path("test.json", is_file=True)
        self.assertEqual(result, self.repo_dir / "test.json")

    @patch("pathlib.Path.exists", return_value=True)
    @patch("pathlib.Path.is_dir", return_value=True)
    def test_validate_source_path_directory_success(self, mock_is_dir, mock_exists):
        """Test successful validation of a directory path."""
        result = self.installer._validate_source_path("test_dir", is_file=False)
        self.assertEqual(result, self.repo_dir / "test_dir")

    @patch("builtins.print")
    @patch("pathlib.Path.exists", return_value=False)
    def test_validate_source_path_not_exists(self, mock_exists, mock_print):
        """Test validation when path does not exist."""
        result = self.installer._validate_source_path("missing.json", is_file=True)
        self.assertIsNone(result)
        mock_print.assert_called_with(
            "Warning: missing.json not found in repository, skipping..."
        )

    @patch("builtins.print")
    @patch("pathlib.Path.exists", return_value=True)
    @patch("pathlib.Path.is_file", return_value=False)
    def test_validate_source_path_file_but_directory(
        self, mock_is_file, mock_exists, mock_print
    ):
        """Test validation when expecting file but path is directory."""
        result = self.installer._validate_source_path("test.json", is_file=True)
        self.assertIsNone(result)
        mock_print.assert_called_with("Warning: test.json is not a file, skipping...")

    @patch("builtins.print")
    @patch("pathlib.Path.exists", return_value=True)
    @patch("pathlib.Path.is_dir", return_value=False)
    def test_validate_source_path_directory_but_file(
        self, mock_is_dir, mock_exists, mock_print
    ):
        """Test validation when expecting directory but path is file."""
        result = self.installer._validate_source_path("test_dir", is_file=False)
        self.assertIsNone(result)
        mock_print.assert_called_with(
            "Warning: test_dir is not a directory, skipping..."
        )

    # === Symlink Edge Cases (MEDIUM PRIORITY) ===

    @patch("os.symlink")
    @patch("pathlib.Path.exists", return_value=True)
    @patch("pathlib.Path.is_symlink", return_value=False)
    @patch("pathlib.Path.is_dir", return_value=True)
    @patch("shutil.rmtree")
    @patch("pathlib.Path.mkdir")
    def test_create_symlink_remove_existing_directory(
        self,
        mock_mkdir,
        mock_rmtree,
        mock_is_dir,
        mock_is_symlink,
        mock_exists,
        mock_symlink,
    ):
        """Test symlink creation when target is an existing directory."""
        source = self.repo_dir / "a"
        target = self.opencode_dir / "b"

        result = self.installer.create_symlink(source, target)

        self.assertTrue(result)
        mock_rmtree.assert_called_once_with(target)
        mock_symlink.assert_called_once_with(str(source), str(target))

    @patch("os.symlink")
    @patch("pathlib.Path.exists", return_value=True)
    @patch("pathlib.Path.is_symlink", return_value=False)
    @patch("pathlib.Path.is_dir", return_value=False)
    @patch("pathlib.Path.unlink")
    @patch("pathlib.Path.mkdir")
    def test_create_symlink_remove_existing_file(
        self,
        mock_mkdir,
        mock_unlink,
        mock_is_dir,
        mock_is_symlink,
        mock_exists,
        mock_symlink,
    ):
        """Test symlink creation when target is an existing file."""
        source = self.repo_dir / "a"
        target = self.opencode_dir / "b"

        result = self.installer.create_symlink(source, target)

        self.assertTrue(result)
        mock_unlink.assert_called_once()
        mock_symlink.assert_called_once_with(str(source), str(target))

    @patch("pathlib.Path.exists", return_value=False)
    def test_create_symlink_source_not_exists(self, mock_exists):
        """Test symlink creation when source does not exist."""
        source = self.repo_dir / "nonexistent"
        target = self.opencode_dir / "target"

        with self.assertRaises(CopyError) as context:
            self.installer.create_symlink(source, target)

        self.assertIn("Source", str(context.exception))
        self.assertIn("does not exist", str(context.exception))

    # === Special Actions Tests (MEDIUM PRIORITY) ===

    @patch("builtins.print")
    def test_run_special_actions_unknown_action(self, mock_print):
        """Test running unknown special action."""
        # Temporarily add an unknown action to opencode config
        original_config = self.installer.AGENTS_CONFIG["opencode"]["special_actions"]
        self.installer.AGENTS_CONFIG["opencode"]["special_actions"] = ["unknown_action"]

        self.installer._run_special_actions("opencode")

        mock_print.assert_called_with(
            "Warning: Unknown special action 'unknown_action' for opencode"
        )

        # Restore original config
        self.installer.AGENTS_CONFIG["opencode"]["special_actions"] = original_config

    def test_run_special_actions_no_actions(self):
        """Test running special actions when there are none."""
        # opencode has no special actions, should not raise
        self.installer._run_special_actions("opencode")

    # === Error Handling Tests (MEDIUM PRIORITY) ===

    @patch("install.ConfigInstaller.resolve_source")
    @patch("install.ConfigInstaller.create_symlink")
    @patch("install.ConfigInstaller._run_special_actions")
    @patch("pathlib.Path.mkdir")
    def test_install_agent_symlink_failure(
        self, mock_mkdir, mock_special_actions, mock_symlink, mock_resolve
    ):
        """Test agent installation when symlink creation fails."""
        mock_resolve.return_value = self.repo_dir / "opencode/opencode.json"
        mock_symlink.side_effect = CopyError("Symlink failed")

        result = self.installer.install_agent("opencode")

        self.assertFalse(result)
        mock_special_actions.assert_not_called()

    @patch("install.ConfigInstaller.resolve_source", return_value=None)
    @patch("install.ConfigInstaller._run_special_actions")
    @patch("pathlib.Path.mkdir")
    def test_install_agent_source_not_found(
        self, mock_mkdir, mock_special_actions, mock_resolve
    ):
        """Test agent installation when source file is not found."""
        result = self.installer.install_agent("opencode")

        self.assertTrue(result)  # Should still succeed, just skip missing asset
        mock_special_actions.assert_called_once_with("opencode")

    # === Integration Tests (LOW PRIORITY) ===

    @patch("install.ConfigInstaller.resolve_source")
    @patch("install.ConfigInstaller.create_symlink")
    @patch("install.ConfigInstaller._run_special_actions")
    @patch("pathlib.Path.mkdir")
    @patch("builtins.print")
    def test_install_agent_multiple_assets(
        self, mock_print, mock_mkdir, mock_special_actions, mock_symlink, mock_resolve
    ):
        """Test agent installation with multiple assets."""
        # Mock multiple assets for opencode (2 assets: opencode.json, AGENTS.md)
        mock_resolve.side_effect = [
            self.repo_dir / "opencode/opencode.json",
            self.repo_dir / "rules/AGENTS.md",
        ]

        result = self.installer.install_agent("opencode")

        self.assertTrue(result)
        self.assertEqual(mock_symlink.call_count, 2)
        mock_special_actions.assert_called_once_with("opencode")


if __name__ == "__main__":
    unittest.main()
