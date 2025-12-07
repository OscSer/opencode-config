#!/usr/bin/env python3

import sys
from pathlib import Path

from src import agents_config, file_ops
from src.types_def import InstallError


class ConfigInstaller:
    """Handles installation of OpenCode configuration"""

    def __init__(
        self,
        repo_dir: Path | None = None,
        opencode_dir: Path | None = None,
    ):
        self.repo_dir = repo_dir or Path(__file__).resolve().parent.parent
        self.opencode_dir = opencode_dir or Path.home() / ".config" / "opencode"

    def resolve_source(self, relative: str, must_be_file: bool = True) -> Path | None:
        """Resolve source path relative to repo directory"""
        return file_ops.validate_source_path(self.repo_dir, relative, must_be_file)

    def get_target_dir(self, agent_name: str) -> Path:
        """Get the target directory for a given agent"""
        target_dirs = {
            "opencode": self.opencode_dir,
        }
        if agent_name not in target_dirs:
            raise InstallError(f"Unknown agent: {agent_name}")
        return target_dirs[agent_name]

    def install_agent(self, agent_name: str) -> bool:
        """Install a single agent configuration"""
        config = agents_config.AGENTS_CONFIG[agent_name]
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
                    file_ops.create_symlink(source_path, target_path)
                    print(f"✓ Linked {asset['target']}")

            return True

        except (Exception,) as e:
            print(f"Error installing {agent_label}: {e}")
            return False

    def install_all(self) -> bool:
        """Install all agent configurations"""
        print("OpenCode Configuration Installation")
        print("====================================")

        success_flags = []
        for agent_name in agents_config.AGENTS_CONFIG:
            success = self.install_agent(agent_name)
            success_flags.append(success)

        if all(success_flags):
            print("")
            print("✅ Installation complete!")
            print("OpenCode configuration is available in ~/.config/opencode/")
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
