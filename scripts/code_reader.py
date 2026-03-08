import os
import sys

def read_ts_files_to_markdown(input_path, exclude_path=None):
    if exclude_path is None:
        exclude_path = ['node_modules', 'dist', 'build', 'tests']  # Default excluded folders


    if not os.path.isdir(input_path):
        print(f"Error: The path '{input_path}' is not a valid directory.")
        return

    markdown_content = []
    
    # Walk through all files in the directory
    for root, dirs, files in os.walk(input_path):
        dirs[:] = [d for d in dirs if d not in exclude_path]

        for file in sorted(files):
            if file.endswith(".ts"):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, input_path)
                
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        code = f.read()
                    
                    markdown_content.append(f"## File: {relative_path}\n")
                    markdown_content.append("```typescript")
                    markdown_content.append(code)
                    markdown_content.append("```\n")
                    
                except Exception as e:
                    print(f"Error reading file {file_path}: {e}")

    output_file = "backend_src.md"
    try:
        with open(output_file, "w", encoding="utf-8") as f:
            f.write("\n".join(markdown_content))
        print(f"Successfully wrote TypeScript files to '{output_file}'.")
    except Exception as e:
        print(f"Error writing to markdown file: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <input_path>")
    else:
        input_path = sys.argv[1]
        read_ts_files_to_markdown(input_path)