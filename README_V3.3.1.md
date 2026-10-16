Our Quest V3.3.1 login recovery hotfix

Fixes oq33ActualAdmin is not a function at startup. The original isAdmin is a top-level lexical const, not window.isAdmin. Uses the current player ID directly for V3.3 admin display controls. Existing cloud data is not reset.

Install all package files over the current GitHub Pages files and hard refresh.
