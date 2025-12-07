from pathlib import Path


from src import agents_config


def test_agents_config_not_empty():
    assert agents_config.AGENTS_CONFIG


def test_agents_have_required_fields():
    for config in agents_config.AGENTS_CONFIG.values():
        assert "label" in config
        assert config["label"]
        assert "assets" in config
        assert config["assets"]
        for asset in config["assets"]:
            assert set(asset.keys()) == {"source", "target", "type"}
            assert asset["source"]
            assert asset["target"]
            assert asset["type"] in {"file", "dir"}


def test_asset_sources_exist_and_match_type():
    repo_root = Path(__file__).resolve().parent.parent

    for config in agents_config.AGENTS_CONFIG.values():
        for asset in config["assets"]:
            source_path = repo_root / asset["source"]
            assert source_path.exists(), f"Missing asset: {asset['source']}"
            if asset["type"] == "file":
                assert source_path.is_file(), f"Expected file: {asset['source']}"
            else:
                assert source_path.is_dir(), f"Expected directory: {asset['source']}"
