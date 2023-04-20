import json
import os
import glob
import pathlib
from templates import base_template, check_template, checks_header, issues_found
from constants import (
    REPO_CONTRACT_PATH,
    FN,
    OUTFILE,
    IMPACTS,
    OMIT_KEYS,
    OMIT_CHECKS,
    OMIT_FOLDERS,
    STARS,
    IGNORED_DIR,
    ERC_GLOB,
    EXCLUDED_DETECTORS
)


def find_unlisted_contracts(contracts_list: list, contracts_folder: str):
    contracts_folder = pathlib.Path(contracts_folder)
    unlisted_paths = []

    for file_path in contracts_folder.rglob("*.sol"):
        formatted_path = str(file_path).replace("\\", "/")

        if formatted_path.startswith(IGNORED_DIR):
            continue

        if formatted_path not in contracts_list:
            unlisted_paths.append(formatted_path)

    return unlisted_paths

def get_erc_checks() -> str:
    check_str = ""
    for check in glob.glob(ERC_GLOB):
        with open(check, "r") as f:
            check_str += f"\n{f.read()}"
    return check_str


def parse_results(results):
    markdown_data = {}
    items_count = {"High": 0, "Medium": 0, "Low": 0, "Optimization": 0}
    contracts = []

    for check in results:
        contract_name = check["first_markdown_element"].split("#")[0]
        if contract_name not in contracts:
            contracts.append(contract_name)
        if (
            check.get("impact") in IMPACTS
            and not check["elements"][0]["source_mapping"][
                "filename_relative"
            ].startswith(OMIT_FOLDERS)
            and check["check"] not in OMIT_CHECKS
        ):
            items_count[check["impact"]] += 1

            try:
                markdown_data[check["check"]].append(
                    check_template.format(
                        check["impact"],
                        check["confidence"],
                        check["first_markdown_element"].split("#")[-1],
                        check["markdown"].replace(
                            "contracts/", f"{REPO_CONTRACT_PATH}contracts/"
                        ),
                    )
                )
            except KeyError:
                markdown_data[check["check"]] = [
                    check_template.format(
                        check["impact"],
                        check["confidence"],
                        check["first_markdown_element"].split("#")[-1],
                        check["markdown"].replace(
                            "contracts/", f"{REPO_CONTRACT_PATH}contracts/"
                        ),
                    )
                ]

            print(
                f"{STARS}\n\n>>> {check['elements'][0]['source_mapping']['filename_relative']}\n"
            )

            for k, v in check.items():
                if k not in OMIT_KEYS:
                    print(f"{k}\n\t{v}\n")

    return markdown_data, items_count, contracts


def generate_header(items_count, contracts):
    nl = "\n\n"
    header = (
        "# Slither Results\n\n"
        + issues_found.format(
            items_count["High"],
            items_count["Medium"],
            items_count["Low"],
            items_count["Optimization"],
        )
        + f"\n\n# Excluded Detectors\n \n {''.join([f'- *{x}*{nl}' for x in EXCLUDED_DETECTORS])}"
        + "\n## Smart Contracts Analysed With Issues: \n"
        + "".join([f"- [{x}]({REPO_CONTRACT_PATH}{x})\n" for x in contracts])
        + "\n## Smart Contracts Analysed With NO Issues: \n"
        + "".join(
            [
                f"- [{x}]({REPO_CONTRACT_PATH}{x})\n"
                for x in find_unlisted_contracts(contracts, "contracts")
            ]
        )
        + "\n\n"
    )
    return header


def write_output(header, markdown_data):
    done = []
    with open(OUTFILE, "w") as f:
        f.write(header)
        for checkType, items in markdown_data.items():
            summary = f"\n\n# {checkType}\n\n> Items Found: {len(items)}\n"
            for i, item in enumerate(items):
                summary += f"\n_Item {i+1} / {len(items)}_\n{item}"
            f.write(summary)
        f.write(checks_header + get_erc_checks())


def main():
    with open(FN) as f:
        results = json.load(f)["results"]["detectors"]

    markdown_data, items_count, contracts = parse_results(results)
    header = generate_header(items_count, contracts)
    write_output(header, markdown_data)


if __name__ == "__main__":
    main()
