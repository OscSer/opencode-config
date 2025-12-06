from pathlib import Path

import pytest

from src.installer import ConfigInstaller
from src.types_def import InstallError


def test_resolve_source_returns_path_when_valid(tmp_path):
    repo_dir = tmp_path / "repo"
    repo_dir.mkdir()
    asset = repo_dir / "asset.txt"
    asset.write_text("data")
    installer = ConfigInstaller(repo_dir=repo_dir, opencode_dir=tmp_path / "target")

    resolved = installer.resolve_source("asset.txt", must_be_file=True)

    assert resolved == asset


def test_resolve_source_returns_none_on_type_mismatch(capsys, tmp_path):
    repo_dir = tmp_path / "repo"
    repo_dir.mkdir()
    directory = repo_dir / "folder"
    directory.mkdir()
    installer = ConfigInstaller(repo_dir=repo_dir, opencode_dir=tmp_path / "target")

    resolved = installer.resolve_source("folder", must_be_file=True)

    captured = capsys.readouterr()

    assert resolved is None
    assert "not a file" in captured.out


def test_get_target_dir_opencode(tmp_path):
    opencode_dir = tmp_path / "opencode"
    installer = ConfigInstaller(repo_dir=tmp_path, opencode_dir=opencode_dir)

    assert installer.get_target_dir("opencode") == opencode_dir


def test_get_target_dir_unknown_agent():
    installer = ConfigInstaller()

    with pytest.raises(InstallError):
        installer.get_target_dir("unknown")
