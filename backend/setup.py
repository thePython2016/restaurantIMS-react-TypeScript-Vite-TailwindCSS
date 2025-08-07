#!/usr/bin/env python3
"""
Setup script for Django backend
Run this script to initialize the Django project
"""

import os
import subprocess
import sys

def run_command(command):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error running command '{command}': {e}")
        print(f"Error output: {e.stderr}")
        return None

def main():
    print("Setting up Django backend...")
    
    # Check if Python is available
    if run_command("python --version") is None:
        print("Python is not available. Please install Python 3.8+")
        return
    
    # Install requirements
    print("Installing requirements...")
    if run_command("pip install -r requirements.txt") is None:
        print("Failed to install requirements")
        return
    
    # Create .env file if it doesn't exist
    env_file = ".env"
    if not os.path.exists(env_file):
        print("Creating .env file...")
        with open(env_file, "w") as f:
            f.write("""# Django settings
SECRET_KEY=django-insecure-your-secret-key-here-change-this
DEBUG=True

# JWT settings
JWT_SECRET_KEY=your-jwt-secret-key-here-change-this

# Google OAuth settings
GOOGLE_CLIENT_ID=your-google-client-id-here
""")
        print("Created .env file. Please update it with your actual values.")
    
    # Run migrations
    print("Running migrations...")
    if run_command("python manage.py makemigrations") is None:
        print("Failed to create migrations")
        return
    
    if run_command("python manage.py migrate") is None:
        print("Failed to run migrations")
        return
    
    # Create superuser
    print("Creating superuser...")
    print("You can skip this by pressing Ctrl+C")
    try:
        run_command("python manage.py createsuperuser")
    except KeyboardInterrupt:
        print("Skipped superuser creation")
    
    print("\nSetup complete!")
    print("To start the Django server, run:")
    print("python manage.py runserver")
    print("\nMake sure to:")
    print("1. Update the .env file with your actual Google Client ID")
    print("2. Update the JWT_SECRET_KEY in .env")
    print("3. Update the SECRET_KEY in .env")

if __name__ == "__main__":
    main() 