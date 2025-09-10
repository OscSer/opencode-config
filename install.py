#!/usr/bin/env python3

import sys
import json
import os
import shutil
from pathlib import Path
from tempfile import NamedTemporaryFile
from typing import Optional, TypedDict, Any, Dict, List, cast


class InstallError(Exception):
    """Base exception for installation errors"""

    pass


class CopyError(InstallError):
    """Exception raised when copy operations fail"""

    pass


class ConfigError(InstallError):
    """Exception raised when configuration operations fail"""

    pass


class AgentConfig(TypedDict):
    label: str
    settings_source: str
    settings_target: str
    rules_source: str
    rules_target: str


class ConfigInstaller:
    """Handles installation of Claude Code and Codex configurations"""

    AGENTS_CONFIG: Dict[str, AgentConfig] = {
        "claude": {
            "label": "Claude Code",
            "settings_source": "settings.json",
            "settings_target": "settings.json",
            "rules_source": "rules/AGENTS.md",
            "rules_target": "CLAUDE.md",
        },
        "codex": {
            "label": "Codex",
            "settings_source": "config.toml",
            "settings_target": "config.toml",
            "rules_source": "rules/AGENTS.md",
            "rules_target": "AGENTS.md",
        },
        "opencode": {
            "label": "Opencode",
            "settings_source": "opencode.json",
            "settings_target": "opencode.json",
            "rules_source": "rules/AGENTS.md",
            "rules_target": "AGENTS.md",
        },
    }

    def __init__(
        self,
        repo_dir: Optional[Path] = None,
        claude_dir: Optional[Path] = None,
        codex_dir: Optional[Path] = None,
        opencode_dir: Optional[Path] = None,
    ):
        self.repo_dir = repo_dir or Path(__file__).parent.absolute()
        self.claude_dir = claude_dir or Path.home() / ".claude"
        self.codex_dir = codex_dir or Path.home() / ".codex"
        self.opencode_dir = opencode_dir or Path.home() / ".config" / "opencode"

    def resolve_source(
        self, relative: str, must_be_file: bool = True
    ) -> Optional[Path]:
        full_path = self.repo_dir / relative

        if must_be_file:
            if not full_path.is_file():
                if not full_path.exists():
                    print(f"Warning: {relative} not found in repository, skipping...")
                else:
                    print(f"Warning: {relative} is not a file, skipping...")
                return None
        else:
            if not full_path.is_dir():
                if not full_path.exists():
                    print(f"Warning: {relative} not found in repository, skipping...")
                else:
                    print(f"Warning: {relative} is not a directory, skipping...")
                return None

        return full_path

    def get_target_dir(self, agent_name: str) -> Path:
        """Get the target directory for a given agent"""
        target_dirs = {
            "claude": self.claude_dir,
            "codex": self.codex_dir,
            "opencode": self.opencode_dir,
        }
        if agent_name not in target_dirs:
            raise InstallError(f"Unknown agent: {agent_name}")
        return target_dirs[agent_name]

    def create_symlink(self, source: Path, target: Path) -> bool:
        if not source.exists():
            raise CopyError(f"Source {source} does not exist")
        try:
            target.parent.mkdir(parents=True, exist_ok=True)
            if target.exists() or target.is_symlink():
                if target.is_dir() and not target.is_symlink():
                    shutil.rmtree(target)
                else:
                    target.unlink()
            os.symlink(str(source), str(target))
            return True
        except Exception as link_error:
            raise CopyError(f"Failed to symlink {source} to {target}: {link_error}")

    def update_claude_mcp_config(self) -> bool:
        """Update Claude MCP configuration"""
        mcp_source = self.resolve_source("claude/.mcp.json", must_be_file=True)
        claude_config = Path.home() / ".claude.json"

        if mcp_source is None:
            print("Warning: claude/.mcp.json not found, skipping MCP configuration...")
            return False

        print("Updating Claude MCP configuration...")

        try:
            with open(mcp_source, "r") as f:
                mcp_data: Dict[str, Any] = json.load(f)

            if "mcpServers" not in mcp_data:
                raise ConfigError("mcpServers not found in claude/.mcp.json")

            claude_data: Dict[str, Any] = {}
            if claude_config.exists():
                with open(claude_config, "r") as f:
                    claude_data = json.load(f)

            claude_data["mcpServers"] = mcp_data["mcpServers"]

            claude_config.parent.mkdir(parents=True, exist_ok=True)
            with NamedTemporaryFile(
                "w",
                delete=False,
                dir=str(claude_config.parent),
                prefix=f"{claude_config.name}.tmp.",
            ) as tmp:
                json.dump(claude_data, tmp, indent=2)
                tmp.flush()
                os.fsync(tmp.fileno())
                tmp_name = tmp.name
            os.replace(tmp_name, claude_config)

            print("✓ MCP configuration updated successfully")
            return True

        except (json.JSONDecodeError, OSError) as e:
            raise ConfigError(f"Failed to update MCP configuration: {e}")

    def install_agent(self, agent_name: str) -> bool:
        config = self.AGENTS_CONFIG[agent_name]
        agent_label = config["label"]
        target_dir = self.get_target_dir(agent_name)

        print(f"Installing {agent_label} configuration...")

        try:
            target_dir.mkdir(parents=True, exist_ok=True)

            # Install settings as symlink for all agents
            settings_source_rel = f"{agent_name}/{config['settings_source']}"
            settings_source_path = self.resolve_source(
                settings_source_rel, must_be_file=True
            )
            if settings_source_path is not None:
                print(f"Linking {agent_label} configuration...")
                self.create_symlink(
                    settings_source_path,
                    target_dir / config["settings_target"],
                )
                print(f"✓ {agent_label} configuration linked")

            # Link rules as symlink
            rules_source_path = self.resolve_source(
                config["rules_source"], must_be_file=True
            )
            if rules_source_path is not None:
                doc_name = config["rules_target"]
                print(f"Linking shared {doc_name} for {agent_label}...")
                if self.create_symlink(
                    rules_source_path,
                    target_dir / doc_name,
                ):
                    print(f"✓ {agent_label} shared {doc_name} linked")

            # Update MCP configuration for Claude
            if agent_name == "claude":
                if (
                    self.resolve_source("claude/.mcp.json", must_be_file=True)
                    is not None
                ):
                    self.update_claude_mcp_config()
            # Opencode uses JSON config that already includes MCP servers
            # Codex uses a TOML config that already includes MCP servers

            return True

        except (CopyError, ConfigError, OSError) as e:
            print(f"Error installing {agent_label}: {e}")
            return False

    def install_all(self) -> bool:
        """Install all agent configurations"""
        print("Claude Code, Codex & Opencode Configuration Installation")
        print("===================================================")

        success_flags: List[bool] = []
        for agent_name in self.AGENTS_CONFIG:
            success = self.install_agent(agent_name)
            success_flags.append(success)

        if all(success_flags):
            print("")
            print("✅ Installation complete!")
            print("Claude Code configuration is available in ~/.claude/")
            print("Codex configuration is available in ~/.codex/")
            print("Opencode configuration is available in ~/.config/opencode/")
            return True
        else:
            print("")
            print(
                "⚠️ Installation completed with some errors. Check the output above for details."
            )
            return False


def main():
    """Main installation function"""
    try:
        installer = ConfigInstaller()
        success = installer.install_all()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\nInstallation interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error during installation: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
