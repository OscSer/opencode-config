#!/usr/bin/env python3

from typing import TypedDict


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
    assets: list[AgentAsset]
