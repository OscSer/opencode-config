#!/usr/bin/env python3

import os
import shutil
from pathlib import Path
from typing import Optional

from src.types_def import CopyError


def validate_source_path(
    repo_dir: Path, relative_path: str, is_file: bool
) -> Optional[Path]:
    """Validate source path and return Path object if valid"""
    full_path = repo_dir / relative_path

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


def create_symlink(source: Path, target: Path) -> bool:
    """Create a symlink from source to target"""
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
