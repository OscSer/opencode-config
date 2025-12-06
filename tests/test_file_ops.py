import os
from pathlib import Path

import pytest

from src import file_ops
from src.types_def import CopyError


def test_validate_source_path_missing(capsys, tmp_path):
    path = file_ops.validate_source_path(tmp_path, "missing.txt", True)

    captured = capsys.readouterr()

    assert path is None
    assert "not found" in captured.out


def test_validate_source_path_requires_file(capsys, tmp_path):
    directory = tmp_path / "data"
    directory.mkdir()

    path = file_ops.validate_source_path(tmp_path, "data", True)

    captured = capsys.readouterr()

    assert path is None
    assert "not a file" in captured.out


def test_validate_source_path_requires_directory(capsys, tmp_path):
    file_path = tmp_path / "file.txt"
    file_path.write_text("content")

    path = file_ops.validate_source_path(tmp_path, "file.txt", False)

    captured = capsys.readouterr()

    assert path is None
    assert "not a directory" in captured.out


def test_validate_source_path_returns_path(tmp_path):
    file_path = tmp_path / "file.txt"
    file_path.write_text("content")

    path = file_ops.validate_source_path(tmp_path, "file.txt", True)

    assert path == file_path


def test_create_symlink_creates_and_points(tmp_path):
    source = tmp_path / "source.txt"
    source.write_text("data")
    target = tmp_path / "links" / "link.txt"

    result = file_ops.create_symlink(source, target)

    assert result is True
    assert target.is_symlink()
    assert Path(os.readlink(target)) == source.resolve()


def test_create_symlink_replaces_existing_symlink(tmp_path):
    source = tmp_path / "source.txt"
    source.write_text("data")
    other = tmp_path / "other.txt"
    other.write_text("other")
    target = tmp_path / "link.txt"
    os.symlink(str(other), str(target))

    file_ops.create_symlink(source, target)

    assert Path(os.readlink(target)) == source.resolve()


def test_create_symlink_replaces_directory(tmp_path):
    source = tmp_path / "source.txt"
    source.write_text("data")
    target = tmp_path / "dir_target"
    target.mkdir()
    (target / "old.txt").write_text("old")

    file_ops.create_symlink(source, target)

    assert target.is_symlink()
    assert Path(os.readlink(target)) == source.resolve()


def test_create_symlink_raises_when_source_missing(tmp_path):
    target = tmp_path / "link.txt"

    with pytest.raises(CopyError):
        file_ops.create_symlink(tmp_path / "missing.txt", target)
