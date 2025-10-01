import subprocess
import random
import os

# --- Configuration ---
# Timestamp to start the first commit (in seconds since epoch)
start_timestamp = 1754797950

# Path to the repository
repo_path = "/Users/jineshjain/Desktop/delydelx"

# New author details
new_authors = [
    {"name": "Jineshbansal", "email": "732005jinesh@gmail.com"},
    {"name": "sivasathyaseeelan", "email": "dnsiva.sathyaseelan.chy21@iitbhu.ac.in"},
]

# --- Main Script ---

# 1. Create a temporary file for the commit callback
callback_script = f"""
import random

# This state will be preserved across calls to the callback
if 'timestamp' not in globals():
    timestamp = {start_timestamp}

def commit_callback(commit):
    global timestamp

    # Choose a random author for this commit
    new_author = random.choice({new_authors})
    commit.author_name = new_author["name"].encode('utf-8')
    commit.author_email = new_author["email"].encode('utf-8')
    commit.committer_name = commit.author_name
    commit.committer_email = commit.author_email

    # Set the author and committer dates
    commit.author_date = f"{{timestamp}} +0530".encode('utf-8')
    commit.committer_date = commit.author_date

    # Increment the timestamp for the next commit
    random_increment = random.randint(36000, 64800) # 10 to 18 hours
    timestamp += random_increment
"""

callback_filename = "temp_callback.py"
with open(os.path.join(repo_path, callback_filename), "w") as f:
    f.write(callback_script)

# 2. Run git filter-repo with the callback
print("Rewriting git history... This may take a while.")

# Add current dir to python path, then import and run callback
callback_command = (
    "import sys; "
    f"sys.path.insert(0, r'{repo_path}'); "
    f"from {callback_filename.replace('.py', '')} import commit_callback; "
    "commit_callback(commit)"
)

command = [
    "git",
    "filter-repo",
    "--force",
    "--commit-callback",
    callback_command,
]

try:
    subprocess.run(
        command,
        cwd=repo_path,
        check=True,
        text=True,
        capture_output=True,
    )
    print("All commits have been updated successfully!")

except subprocess.CalledProcessError as e:
    print("Error rewriting git history:")
    print("stdout:", e.stdout)
    print("stderr:", e.stderr)

finally:
    # 3. Clean up the temporary callback file
    os.remove(os.path.join(repo_path, callback_filename))

    # 4. Checkout back to the main branch
    try:
        subprocess.run(
            ["git", "checkout", "main"],
            cwd=repo_path,
            check=True,
            text=True,
            capture_output=True,
        )
    except subprocess.CalledProcessError as e:
        print(f"Could not checkout main branch. Please do it manually.")
        print(e.stderr)