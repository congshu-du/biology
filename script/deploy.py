import subprocess
import os
import time

try:
    subprocess.run(["nvm", "use", "18.20.4"], check=True)
    time.sleep(1)
    node_path = subprocess.check_output(["where", "node"], text=True).strip()
    npm_cmd = os.path.join(os.path.dirname(node_path), "npm.cmd")

    subprocess.run(["rm", "-rf", "dist"], check=True)
    subprocess.run([npm_cmd, "install"], check=True)
    subprocess.run([npm_cmd, "run", "build"], check=True)

    print("Build completed successfully.")

    server = os.getenv("SERVER") or "192.168.200.80"
    username = os.getenv("USER_NAME") or "ducongshu"
    remote_path = "/tmp"
    file_path = "/var/www/frontend"
    conf_name = "frontend.conf"
    conf_path = f"/etc/nginx/conf.d/{conf_name}"
    command = """
				mkdir -p "/var/www"
				mkdir -p "/etc/nginx/conf.d"
		"""

    subprocess.run(["ssh", f"{username}@{server}", command], check=True)

    # Deploy dist folder
    subprocess.run(
        ["scp", "-r", "dist", f"{username}@{server}:{remote_path}"], check=True
    )
    subprocess.run(
        [
            "ssh",
            f"{username}@{server}",
            f"rm -rf {file_path} && mv {remote_path}/dist {file_path}",
        ],
        check=True,
    )

    # Deploy nginx config
    subprocess.run(
        ["scp", f"deploy/{conf_name}", f"{username}@{server}:{remote_path}"], check=True
    )
    subprocess.run(
        [
            "ssh",
            f"{username}@{server}",
            f"rm -rf {conf_path} && mv {remote_path}/{conf_name} {conf_path} && chmod 777 {conf_path}",
        ],
        check=True,
    )

    print("Build and upload completed successfully.")
except subprocess.CalledProcessError as e:
    print(f"An error occurred: {e}")
