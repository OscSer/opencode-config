import unittest
from unittest.mock import patch, MagicMock, mock_open, call
import sys
import os
import json
import shutil
import tempfile
from pathlib import Path

# Add root directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from install import ConfigInstaller, InstallError, CopyError, ConfigError


class TestConfigInstaller(unittest.TestCase):

    def setUp(self):
        """Set up a test environment."""
        self.repo_dir = Path("/fake/repo")
        self.home_dir = Path("/fake/home")

        self.claude_dir = self.home_dir / ".claude"
        self.opencode_dir = self.home_dir / ".config" / "opencode"

        # Patch Path.home() to return our fake home directory
        self.path_home_patch = patch("pathlib.Path.home", return_value=self.home_dir)
        self.path_home_mock = self.path_home_patch.start()

        self.installer = ConfigInstaller(
            repo_dir=self.repo_dir,
            claude_dir=self.claude_dir,
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

        source_path = self.installer.resolve_source("claude/settings.json")
        self.assertEqual(source_path, self.repo_dir / "claude/settings.json")

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
        self.assertEqual(self.installer.get_target_dir("claude"), self.claude_dir)
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
        target = self.claude_dir / "b"

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
        target = self.claude_dir / "b"

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
        mock_resolve.return_value = self.repo_dir / "claude/settings.json"

        result = self.installer.install_agent("claude")

        self.assertTrue(result)
        mock_mkdir.assert_called_with(parents=True, exist_ok=True)
        self.assertTrue(mock_symlink.called)
        mock_special_actions.assert_called_once_with("claude")

    @patch("install.ConfigInstaller.install_agent", return_value=True)
    def test_install_all_success(self, mock_install_agent):
        """Test successful installation of all agents."""
        self.assertTrue(self.installer.install_all())
        self.assertEqual(mock_install_agent.call_count, 2)

    @patch("install.ConfigInstaller.install_agent", side_effect=[True, False, True])
    def test_install_all_with_errors(self, mock_install_agent):
        """Test installation of all agents with some failures."""
        self.assertFalse(self.installer.install_all())
        self.assertEqual(mock_install_agent.call_count, 2)

    # === MCP Configuration Tests (CRITICAL) ===

    @patch(
        "builtins.open",
        new_callable=mock_open,
        read_data='{"mcpServers": {"test": "server"}}',
    )
    @patch("pathlib.Path.exists", return_value=False)
    @patch("install.ConfigInstaller.resolve_source")
    @patch("json.dump")
    @patch("os.replace")
    @patch("os.fsync")
    @patch("pathlib.Path.mkdir")
    @patch("install.NamedTemporaryFile")
    def test_update_claude_mcp_config_success(
        self,
        mock_tempfile,
        mock_mkdir,
        mock_fsync,
        mock_replace,
        mock_json_dump,
        mock_resolve,
        mock_exists,
        mock_file,
    ):
        """Test successful MCP configuration update."""
        # Mock temporary file
        mock_tmp_file = MagicMock()
        mock_tmp_file.name = "/fake/tmp/config.json.tmp"
        mock_tmp_file.fileno.return_value = 1  # Mock file descriptor
        mock_tmp_file.__enter__ = MagicMock(return_value=mock_tmp_file)
        mock_tmp_file.__exit__ = MagicMock(return_value=None)
        mock_tempfile.return_value = mock_tmp_file

        mock_resolve.return_value = self.repo_dir / "claude/.mcp.json"

        result = self.installer.update_claude_mcp_config()

        self.assertTrue(result)
        mock_json_dump.assert_called_once()
        mock_replace.assert_called_once()
        mock_mkdir.assert_called_with(parents=True, exist_ok=True)
        mock_fsync.assert_called_once()

    @patch("builtins.open", new_callable=mock_open, read_data='{"invalid": "data"}')
    @patch("pathlib.Path.exists")
    @patch("install.ConfigInstaller.resolve_source")
    def test_update_claude_mcp_config_missing_mcp_servers(
        self, mock_resolve, mock_exists, mock_file
    ):
        """Test MCP config update when mcpServers is missing."""
        mock_resolve.return_value = self.repo_dir / "claude/.mcp.json"
        mock_exists.return_value = False

        with self.assertRaises(ConfigError) as context:
            self.installer.update_claude_mcp_config()

        self.assertIn("mcpServers not found", str(context.exception))

    @patch("builtins.open", side_effect=json.JSONDecodeError("Invalid JSON", "doc", 1))
    @patch("pathlib.Path.exists")
    @patch("install.ConfigInstaller.resolve_source")
    def test_update_claude_mcp_config_json_decode_error(
        self, mock_resolve, mock_exists, mock_file
    ):
        """Test MCP config update with invalid JSON."""
        mock_resolve.return_value = self.repo_dir / "claude/.mcp.json"
        mock_exists.return_value = True

        with self.assertRaises(ConfigError) as context:
            self.installer.update_claude_mcp_config()

        self.assertIn("Failed to update MCP configuration", str(context.exception))

    @patch("install.ConfigInstaller.resolve_source", return_value=None)
    @patch("builtins.print")
    def test_update_claude_mcp_config_source_not_found(self, mock_print, mock_resolve):
        """Test MCP config update when source file is not found."""
        result = self.installer.update_claude_mcp_config()

        self.assertFalse(result)
        mock_print.assert_called_with(
            "Warning: claude/.mcp.json not found, skipping MCP configuration..."
        )

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
        target = self.claude_dir / "b"

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
        target = self.claude_dir / "b"

        result = self.installer.create_symlink(source, target)

        self.assertTrue(result)
        mock_unlink.assert_called_once()
        mock_symlink.assert_called_once_with(str(source), str(target))

    @patch("pathlib.Path.exists", return_value=False)
    def test_create_symlink_source_not_exists(self, mock_exists):
        """Test symlink creation when source does not exist."""
        source = self.repo_dir / "nonexistent"
        target = self.claude_dir / "target"

        with self.assertRaises(CopyError) as context:
            self.installer.create_symlink(source, target)

        self.assertIn("Source", str(context.exception))
        self.assertIn("does not exist", str(context.exception))

    # === Special Actions Tests (MEDIUM PRIORITY) ===

    @patch("builtins.print")
    def test_run_special_actions_unknown_action(self, mock_print):
        """Test running unknown special action."""
        # Temporarily add an unknown action to claude config
        original_config = self.installer.AGENTS_CONFIG["claude"]["special_actions"]
        self.installer.AGENTS_CONFIG["claude"]["special_actions"] = ["unknown_action"]

        self.installer._run_special_actions("claude")

        mock_print.assert_called_with(
            "Warning: Unknown special action 'unknown_action' for claude"
        )

        # Restore original config
        self.installer.AGENTS_CONFIG["claude"]["special_actions"] = original_config

    @patch("install.ConfigInstaller.update_claude_mcp_config")
    def test_run_special_actions_valid_action(self, mock_update_mcp):
        """Test running valid special action."""
        self.installer._run_special_actions("claude")
        mock_update_mcp.assert_called_once()

    # === Error Handling Tests (MEDIUM PRIORITY) ===

    @patch("install.ConfigInstaller.resolve_source")
    @patch("install.ConfigInstaller.create_symlink")
    @patch("install.ConfigInstaller._run_special_actions")
    @patch("pathlib.Path.mkdir")
    def test_install_agent_symlink_failure(
        self, mock_mkdir, mock_special_actions, mock_symlink, mock_resolve
    ):
        """Test agent installation when symlink creation fails."""
        mock_resolve.return_value = self.repo_dir / "claude/settings.json"
        mock_symlink.side_effect = CopyError("Symlink failed")

        result = self.installer.install_agent("claude")

        self.assertFalse(result)
        mock_special_actions.assert_not_called()

    @patch("install.ConfigInstaller.resolve_source", return_value=None)
    @patch("install.ConfigInstaller._run_special_actions")
    @patch("pathlib.Path.mkdir")
    def test_install_agent_source_not_found(
        self, mock_mkdir, mock_special_actions, mock_resolve
    ):
        """Test agent installation when source file is not found."""
        result = self.installer.install_agent("claude")

        self.assertTrue(result)  # Should still succeed, just skip missing asset
        mock_special_actions.assert_called_once_with("claude")

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
        # Mock multiple assets for claude
        mock_resolve.side_effect = [
            self.repo_dir / "claude/settings.json",
            self.repo_dir / "rules/AGENTS.md",
        ]

        result = self.installer.install_agent("claude")

        self.assertTrue(result)
        self.assertEqual(mock_symlink.call_count, 2)
        mock_special_actions.assert_called_once_with("claude")


if __name__ == "__main__":
    unittest.main()
