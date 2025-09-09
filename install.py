#!/usr/bin/env python3

import sys
import json
import os
import shutil
from pathlib import Path
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
    commands_target: str
    rules_source: str
    rules_target: str
    has_mcp: bool


class ConfigInstaller:
    """Handles installation of Claude Code configuration"""

    AGENTS_CONFIG: Dict[str, AgentConfig] = {
        "claude": {
            "label": "Claude Code",
            "settings_source": "settings.json",
            "settings_target": "settings.json",
            "commands_target": "commands",
            "rules_source": "rules/AGENTS.md",
            "rules_target": "CLAUDE.md",
            "has_mcp": True,
        },
    }

    def __init__(self, repo_dir: Optional[Path] = None):
        self.repo_dir = repo_dir or Path(__file__).parent.absolute()
        self.claude_dir = Path.home() / ".claude"

    def validate_source(self, path: str) -> bool:
        """Validate that source path exists in repository"""
        full_path = self.repo_dir / path
        if not full_path.exists():
            print(f"Warning: {path} not found in repository, skipping...")
            return False
        return True

    def load_env_file(self) -> Dict[str, str]:
        """Load variables from .env file in repository directory"""
        env_path = self.repo_dir / ".env"
        env_vars: Dict[str, str] = {}

        if env_path.exists():
            with open(env_path, "r") as f:
                for line in f:
                    line = line.strip()
                    if line and "=" in line and not line.startswith("#"):
                        key, value = line.split("=", 1)
                        env_vars[key] = value.strip('"').strip("'")
        return env_vars

    def validate_required_env(self) -> bool:
        """Validate that OPENROUTER_API_KEY exists"""
        # First check system environment variables
        if os.getenv("OPENROUTER_API_KEY"):
            return True

        # Then check .env file in repository
        env_vars = self.load_env_file()
        if env_vars.get("OPENROUTER_API_KEY"):
            return True

        print("❌ OPENROUTER_API_KEY not found")
        print("Create .env file in this directory:")
        print(f"  echo 'OPENROUTER_API_KEY=your-key-here' > {self.repo_dir}/.env")
        return False

    def expand_env_variables(self, data: Any, env_vars: Dict[str, str]) -> Any:
        """Expand environment variables in dictionary values recursively"""
        if isinstance(data, dict):
            expanded: Dict[str, Any] = {}
            data_dict = cast(Dict[str, Any], data)
            for key, value in data_dict.items():
                expanded[key] = self.expand_env_variables(value, env_vars)
            return expanded
        elif isinstance(data, list):
            data_list = cast(List[Any], data)
            return [self.expand_env_variables(item, env_vars) for item in data_list]
        elif isinstance(data, str) and data.startswith('${') and data.endswith('}'):
            var_name = data[2:-1]  # Remove ${ and }
            # First check .env file, then system environment
            if var_name in env_vars:
                return env_vars[var_name]
            elif var_name in os.environ:
                return os.environ[var_name]
            else:
                print(f"Warning: Environment variable '{var_name}' not found, keeping original value")
                return data
        else:
            return data

    def copy_file_or_dir(self, source: Path, target: Path) -> bool:
        """Copy file or directory to target location"""
        if not source.exists():
            raise CopyError(f"Source {source} does not exist")

        try:
            if target.exists() or target.is_symlink():
                if target.is_dir() and not target.is_symlink():
                    shutil.rmtree(target)
                else:
                    target.unlink()

            if source.is_dir():
                shutil.copytree(source, target)
            else:
                shutil.copy2(source, target)
            return True

        except Exception as copy_error:
            raise CopyError(f"Failed to copy {source} to {target}: {copy_error}")

    def update_claude_mcp_config(self) -> bool:
        """Update Claude MCP configuration"""
        mcp_source = self.repo_dir / "claude" / ".mcp.json"
        claude_config = Path.home() / ".claude.json"

        if not mcp_source.exists():
            print("Warning: claude/.mcp.json not found, skipping MCP configuration...")
            return False

        print("Updating Claude MCP configuration...")

        try:
            with open(mcp_source, "r") as f:
                mcp_data: Dict[str, Any] = json.load(f)

            if "mcpServers" not in mcp_data:
                raise ConfigError("mcpServers not found in claude/.mcp.json")

            # Load environment variables for expansion
            env_vars = self.load_env_file()
            
            # Expand environment variables in MCP data
            expanded_mcp_data = cast(Dict[str, Any], self.expand_env_variables(mcp_data, env_vars))

            claude_data: Dict[str, Any] = {}
            if claude_config.exists():
                with open(claude_config, "r") as f:
                    claude_data = cast(Dict[str, Any], json.load(f))

            claude_data["mcpServers"] = expanded_mcp_data["mcpServers"]

            with open(claude_config, "w") as f:
                json.dump(claude_data, f, indent=2)

            print("✓ MCP configuration updated successfully")
            return True

        except (json.JSONDecodeError, OSError) as e:
            raise ConfigError(f"Failed to update MCP configuration: {e}")

    def install_agent(self, agent_name: str) -> bool:
        config = self.AGENTS_CONFIG[agent_name]
        agent_label = config["label"]

        # Validate environment for Claude (requires API key)
        if agent_name == "claude" and config.get("has_mcp", False):
            if not self.validate_required_env():
                return False

        if agent_name == "claude":
            target_dir = self.claude_dir
        else:
            raise InstallError(f"Unknown agent: {agent_name}")

        print(f"Installing {agent_label} configuration...")

        try:
            target_dir.mkdir(parents=True, exist_ok=True)

            # Install commands
            commands_source = self.repo_dir / agent_name / "commands"
            if (
                self.validate_source(f"{agent_name}/commands")
                and commands_source.is_dir()
            ):
                print(f"Installing custom commands for {agent_label}...")
                if self.copy_file_or_dir(
                    commands_source, target_dir / config["commands_target"]
                ):
                    print(f"✓ {agent_label} commands installed")

            # Install settings
            settings_source_path = (
                self.repo_dir / agent_name / config["settings_source"]
            )
            if (
                self.validate_source(f"{agent_name}/{config['settings_source']}")
                and settings_source_path.is_file()
            ):
                print(f"Installing {agent_label} configuration...")
                shutil.copy2(
                    settings_source_path,
                    target_dir / config["settings_target"],
                )
                print(f"✓ {agent_label} configuration installed")

            # Install rules
            rules_source_path = self.repo_dir / config["rules_source"]
            if (
                self.validate_source(config["rules_source"])
                and rules_source_path.is_file()
            ):
                doc_name = config["rules_target"]
                print(f"Installing shared {doc_name} for {agent_label}...")
                if self.copy_file_or_dir(
                    rules_source_path,
                    target_dir / doc_name,
                ):
                    print(f"✓ {agent_label} shared {doc_name} installed")

            # Update MCP configuration if needed
            if agent_name == "claude" and config["has_mcp"]:
                if (
                    self.validate_source("claude/.mcp.json")
                    and (self.repo_dir / "claude" / ".mcp.json").is_file()
                ):
                    self.update_claude_mcp_config()

            return True

        except (CopyError, ConfigError, OSError) as e:
            print(f"Error installing {agent_label}: {e}")
            return False

    def install_all(self) -> bool:
        """Install all agent configurations"""
        print("Claude Code Configuration Installation")
        print("=====================================")

        success_flags: List[bool] = []
        for agent_name in self.AGENTS_CONFIG:
            success = self.install_agent(agent_name)
            success_flags.append(success)

        if all(success_flags):
            print("")
            print("✅ Installation complete!")
            print("Claude Code configuration is available in ~/.claude/")
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
