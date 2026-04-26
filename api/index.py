import os
import sys

# Package code lives in ./backend; imports use `api`, `models`, `service`, etc. as top-level.
_pkg = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
if _pkg not in sys.path:
    sys.path.insert(0, _pkg)

from api.app import app

__all__ = ["app"]
