import os

REPO_CONTRACT_PATH = "https://github.com/johnashu/madnfts-solidity-contracts/tree/main/"
FN = os.path.join("Slither", "results", "slither.results.json")
OUTFILE = os.path.join("Slither", "results", "slitherResults.MD")
IMPACTS = ("High", "Medium", "Low", "Optimization")
OMIT_KEYS = ("elements", "markdown", "id", "first_markdown_element")
OMIT_CHECKS = ()
OMIT_FOLDERS = ("test", "script")
IGNORED_DIR = os.path.join("contracts", "lib", "test")
ERC_GLOB = os.path.join("Slither", "results", "erc-checker", "*.MD")
STARS = "*" * 80