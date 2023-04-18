import pathlib

def replace_import_paths(file_path):
    with file_path.open('r') as file:
        lines = file.readlines()

    replaced_lines = []
    for line in lines:
        if line.startswith(('import', "} from")) and './' in line:
            line = line.replace('./', str(file_path.parent) + '/')
        replaced_lines.append(line)

    with file_path.open('w') as file:
        file.writelines(replaced_lines)

def process_files():
    folder = pathlib.Path('contracts')
    for file_path in folder.rglob('*.sol'):
        replace_import_paths(file_path)

if __name__ == '__main__':
    process_files()
