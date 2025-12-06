#!/usr/bin/env python3

import sys
import os
import shutil
from pathlib import Path
from typing import Optional, TypedDict, Dict, List


class InstallError(Exception):
    """Base exception for installation errors"""

    pass


class CopyError(InstallError):
    """Exception raised when copy operations fail"""

    pass


class ConfigError(InstallError):
    """Exception raised when configuration operations fail"""

    pass


class AgentAsset(TypedDict):
    source: str
    target: str
    type: str


class AgentConfig(TypedDict):
    label: str
    assets: List[AgentAsset]
    special_actions: List[str]


class ConfigInstaller:
    """Handles installation of Opencode configuration"""

    AGENTS_CONFIG: Dict[str, AgentConfig] = {
        "opencode": {
            "label": "Opencode",
            "assets": [
                {
                    "source": "opencode/opencode.json",
                    "target": "opencode.json",
                    "type": "file",
                },
                {"source": "rules/AGENTS.md", "target": "AGENTS.md", "type": "file"},
            ],
            "special_actions": [],
        },
    }

    def __init__(
        self,
        repo_dir: Optional[Path] = None,
        opencode_dir: Optional[Path] = None,
    ):
        self.repo_dir = repo_dir or Path(__file__).parent.absolute()
        self.opencode_dir = opencode_dir or Path.home() / ".config" / "opencode"

    def _validate_source_path(
        self, relative_path: str, is_file: bool
    ) -> Optional[Path]:
        """Validate source path and return Path object if valid"""
        full_path = self.repo_dir / relative_path

        if not full_path.exists():
            print(f"Warning: {relative_path} not found in repository, skipping...")
            return None

        if is_file and not full_path.is_file():
            print(f"Warning: {relative_path} is not a file, skipping...")
            return None

        if not is_file and not full_path.is_dir():
            print(f"Warning: {relative_path} is not a directory, skipping...")
            return None

        return full_path

    def resolve_source(
        self, relative: str, must_be_file: bool = True
    ) -> Optional[Path]:
        return self._validate_source_path(relative, must_be_file)

    def get_target_dir(self, agent_name: str) -> Path:
        """Get the target directory for a given agent"""
        target_dirs = {
            "opencode": self.opencode_dir,
        }
        if agent_name not in target_dirs:
            raise InstallError(f"Unknown agent: {agent_name}")
        return target_dirs[agent_name]

    @staticmethod
    def create_symlink(source: Path, target: Path) -> bool:
        if not source.exists():
            raise CopyError(f"Source {source} does not exist")
        try:
            target.parent.mkdir(parents=True, exist_ok=True)
            if target.exists() or target.is_symlink():
                if target.is_dir() and not target.is_symlink():
                    shutil.rmtree(target)
                else:
                    target.unlink()
            os.symlink(str(source.resolve()), str(target))
            return True
        except Exception as link_error:
            raise CopyError(f"Failed to symlink {source} to {target}: {link_error}")

    def _run_special_actions(self, agent_name: str):
        """Run special actions for a given agent"""
        config = self.AGENTS_CONFIG[agent_name]
        for action_name in config.get("special_actions", []):
            action_method = getattr(self, action_name, None)
            if action_method and callable(action_method):
                action_method()
            else:
                print(
                    f"Warning: Unknown special action '{action_name}' for {agent_name}"
                )

    def install_agent(self, agent_name: str) -> bool:
        config = self.AGENTS_CONFIG[agent_name]
        agent_label = config["label"]
        target_dir = self.get_target_dir(agent_name)

        print(f"Installing {agent_label} configuration...")

        try:
            target_dir.mkdir(parents=True, exist_ok=True)

            for asset in config["assets"]:
                source_path = self.resolve_source(
                    asset["source"], must_be_file=asset["type"] == "file"
                )
                if source_path:
                    target_path = target_dir / asset["target"]
                    print(f"Linking {asset['source']} to {target_path}...")
                    self.create_symlink(source_path, target_path)
                    print(f"✓ Linked {asset['target']}")

            self._run_special_actions(agent_name)

            return True

        except (CopyError, ConfigError, OSError) as e:
            print(f"Error installing {agent_label}: {e}")
            return False

    def install_all(self) -> bool:
        """Install all agent configurations"""
        print("Opencode Configuration Installation")
        print("====================================")

        success_flags: List[bool] = []
        for agent_name in self.AGENTS_CONFIG:
            success = self.install_agent(agent_name)
            success_flags.append(success)

        if all(success_flags):
            print("")
            print("✅ Installation complete!")
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
