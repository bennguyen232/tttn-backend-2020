Step 1: Install Ansible

Step 2: Install roles
```bash
ansible-galaxy install -r requirements.yml
```

Step 3: Update `hosts` file with correct host information
Step 4: Install software on target server
```bash
ansible-playbook -i hosts -v <playbook-you-wanna-run>.yml
```
