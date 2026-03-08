import os
import re
import argparse
from pathlib import Path

# Mapping of file extensions to Markdown language identifiers
EXT_TO_LANG = {
    '.ts': 'typescript',
    '.tsx': 'tsx',
    '.html': 'html',
    '.css': 'css',
}

IGNORE_DIRS = {'node_modules'}
def is_ignored(path: Path) -> bool:
    """Return True if the path is inside any ignored directory."""
    return any(part in IGNORE_DIRS for part in path.parts)

def should_include_file(path: Path) -> bool:
    return path.suffix.lower() in EXT_TO_LANG

def get_language_id(suffix: str) -> str:
    return EXT_TO_LANG.get(suffix.lower(), '')

def escape_backticks(content: str) -> str:
    # Replace triple backticks with escaped version to avoid breaking Markdown
    return re.sub(r'```', r'\`\`\`', content)

def collect_files_to_markdown(root_dir: str, output_file: str):
    root_path = Path(root_dir).resolve()
    markdown_lines = [
        f"# Source Code Summary\n\n",
        f"Generated on: {root_path}\n",
        f"File types included: {', '.join(EXT_TO_LANG.keys())}\n",
        f"---\n\n"
    ]

    count = 0
    for file_path in sorted(root_path.rglob('*')):
        if is_ignored(file_path):
            continue

        if file_path.is_file() and should_include_file(file_path):
            rel_path = file_path.relative_to(root_path)
            lang = get_language_id(file_path.suffix)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                content = escape_backticks(content)
                markdown_lines.append(f"## `{rel_path}`\n")
                markdown_lines.append(f"```{lang}")
                markdown_lines.append(content)
                markdown_lines.append("```\n")
                count += 1
            except (UnicodeDecodeError, PermissionError, OSError) as e:
                markdown_lines.append(f"## `{rel_path}`\n")
                markdown_lines.append(f"⚠️ *Error reading file*: `{e}`\n\n")
    
    markdown_lines.append(f"---\n\n*Total files included: {count}*")

    with open(output_file, 'w', encoding='utf-8') as out_f:
        out_f.write('\n'.join(markdown_lines))

    print(f"✅ Markdown file generated: `{output_file}` with {count} files.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Collect .ts, .tsx, .html, .css files into a Markdown document.")
    parser.add_argument(
        "root_dir",
        nargs="?",
        default=".",
        help="Root directory to scan (default: current directory)"
    )
    parser.add_argument(
        "-o", "--output",
        default="source_code_summary.md",
        help="Output Markdown filename (default: source_code_summary.md)"
    )
    args = parser.parse_args()

    collect_files_to_markdown(args.root_dir, args.output)