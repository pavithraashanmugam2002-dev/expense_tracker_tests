
import sys
from pathlib import Path

workspace_root = Path(__file__).parent.parent
sys.path.insert(0, str(workspace_root))
sys.path.insert(0, str(workspace_root / "backend"))
