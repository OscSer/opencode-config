from pathlib import Path
from typing import List

import pytest

from src import agents_config
from src.installer import ConfigInstaller
from src.types_def import InstallError


@pytest.fixture()
def sample_repo(tmp_path) -> Path:
    repo_dir = tmp_path / "repo"
    repo_dir.mkdir()
    assets: List[dict] = []
    for asset in agents_config.AGENTS_CONFIG["opencode"]["assets"]:
        source = repo_dir / asset["source"]
        source.parent.mkdir(parents=True, exist_ok=True)
        source.write_text("data")
        assets.append(source)
    return repo_dir


def test_install_agent_success(monkeypatch, capsys, tmp_path, sample_repo):
    target_dir = tmp_path / "opencode"
    installer = ConfigInstaller(repo_dir=sample_repo, opencode_dir=target_dir)
    created = []

    def fake_symlink(source, target):
        created.append((source, target))
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text("data")
        return True

    monkeypatch.setattr("src.file_ops.create_symlink", fake_symlink)

    success = installer.install_agent("opencode")
    output = capsys.readouterr().out

    assert success is True
    assert "Installing" in output
    assert len(created) == len(agents_config.AGENTS_CONFIG["opencode"]["assets"])
    for (_, target) in created:
        assert target.exists()


def test_install_agent_skips_missing_asset(monkeypatch, capsys, tmp_path):
    repo_dir = tmp_path / "repo"
    repo_dir.mkdir()
    # leave sources missing
    target_dir = tmp_path / "opencode"
    installer = ConfigInstaller(repo_dir=repo_dir, opencode_dir=target_dir)

    monkeypatch.setattr(
        "src.agents_config.AGENTS_CONFIG",
        {
            "opencode": {
                "label": "Opencode",
                "assets": [
                    {"source": "missing.json", "target": "a.json", "type": "file"},
                    {"source": "missing2.json", "target": "b.json", "type": "file"},
                ],
            }
        },
    )
    monkeypatch.setattr("src.file_ops.create_symlink", lambda s, t: (_ for _ in ()).throw(Exception("should not be called")))

    success = installer.install_agent("opencode")
    output = capsys.readouterr().out

    assert success is True
    assert "skipping" in output


def test_install_agent_handles_symlink_error(monkeypatch, capsys, tmp_path, sample_repo):
    target_dir = tmp_path / "opencode"
    installer = ConfigInstaller(repo_dir=sample_repo, opencode_dir=target_dir)

    def failing_symlink(source, target):  # pragma: no cover - behavior test
        raise Exception("boom")

    monkeypatch.setattr("src.file_ops.create_symlink", failing_symlink)

    success = installer.install_agent("opencode")
    output = capsys.readouterr().out

    assert success is False
    assert "Error installing" in output


def test_install_all_handles_failure(monkeypatch, capsys, tmp_path, sample_repo):
    target_dir = tmp_path / "opencode"
    installer = ConfigInstaller(repo_dir=sample_repo, opencode_dir=target_dir)

    call_order = []

    def fake_install(agent_name):
        call_order.append(agent_name)
        return False

    monkeypatch.setattr(ConfigInstaller, "install_agent", lambda self, name: fake_install(name))

    success = installer.install_all()
    output = capsys.readouterr().out

    assert call_order == list(agents_config.AGENTS_CONFIG.keys())
    assert success is False
    assert "completed with some errors" in output


def test_install_all_all_success(monkeypatch, capsys, tmp_path, sample_repo):
    target_dir = tmp_path / "opencode"
    installer = ConfigInstaller(repo_dir=sample_repo, opencode_dir=target_dir)

    monkeypatch.setattr(ConfigInstaller, "install_agent", lambda self, name: True)

    success = installer.install_all()
    output = capsys.readouterr().out

    assert success is True
    assert "Installation complete" in output
