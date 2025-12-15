import os
import sys
from pathlib import Path

def find_routes_files(root_dir):
    """Recursively find all routes.ts files in the directory tree."""
    routes_files = []
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith('routes.ts'):
                full_path = os.path.join(dirpath, filename)
                routes_files.append(full_path)
    
    return sorted(routes_files)  # Sort for consistent ordering

def create_markdown_report(routes_files, output_file='routes_report.md'):
    """Create a markdown file with all routes.ts file contents."""
    
    with open(output_file, 'w', encoding='utf-8') as md_file:
        md_file.write("# routes.ts Files Report\n\n")
        md_file.write(f"Found {len(routes_files)} routes.ts files\n\n")
        
        for i, file_path in enumerate(routes_files, 1):
            # Get relative path for cleaner display
            rel_path = os.path.relpath(file_path)
            
            md_file.write(f"---\n\n")
            md_file.write(f"## File {i}: `{rel_path}`\n\n")
            
            try:
                with open(file_path, 'r', encoding='utf-8') as ts_file:
                    content = ts_file.read()
                    
                md_file.write("```typescript\n")
                md_file.write(content)
                if not content.endswith('\n'):
                    md_file.write('\n')
                md_file.write("```\n\n")
                
            except UnicodeDecodeError:
                # Try with different encoding if utf-8 fails
                try:
                    with open(file_path, 'r', encoding='latin-1') as ts_file:
                        content = ts_file.read()
                    
                    md_file.write("```typescript\n")
                    md_file.write(content)
                    if not content.endswith('\n'):
                        md_file.write('\n')
                    md_file.write("```\n\n")
                    
                except Exception as e:
                    md_file.write(f"*Error reading file: {str(e)}*\n\n")
                    
            except Exception as e:
                md_file.write(f"*Error reading file: {str(e)}*\n\n")
    
    print(f"Markdown report created: {output_file}")
    print(f"Total files processed: {len(routes_files)}")

def main():
    # Check if folder path is provided as argument
    if len(sys.argv) < 2:
        print("Usage: python script.py <folder_path> [output_file.md]")
        print("Example: python script.py ./my-project routes_report.md")
        sys.exit(1)
    
    folder_path = sys.argv[1]
    
    # Set output file name (default or from argument)
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'routes_report.md'
    
    # Check if folder exists
    if not os.path.exists(folder_path):
        print(f"Error: Folder '{folder_path}' does not exist!")
        sys.exit(1)
    
    # Find all routes.ts files
    print(f"Searching for routes.ts files in: {folder_path}")
    routes_files = find_routes_files(folder_path)
    
    if not routes_files:
        print("No routes.ts files found!")
        return
    
    print(f"Found {len(routes_files)} routes.ts files")
    
    # Create markdown report
    create_markdown_report(routes_files, output_file)

if __name__ == "__main__":
    main()