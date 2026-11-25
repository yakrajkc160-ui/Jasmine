"""
Jasmine Pro license generator.
Signs the customer's Device ID with a PRIVATE key that is never stored in this repo.

Where the private key comes from (first one found):
  1. env  JASMINE_LICENSE_PRIVATE_KEY   (the full PEM text, e.g. a GitHub Actions secret)
  2. env  JASMINE_LICENSE_PRIVATE_KEY_FILE   (path to the .pem file)

Usage: python3 scripts/generate_license.py <CUSTOMER_DEVICE_ID>
"""
import base64
import os
import sys

from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec

PREFIX = "JAS2"


def _load_private_key():
    pem = os.environ.get("JASMINE_LICENSE_PRIVATE_KEY", "").strip()
    if not pem:
        path = os.environ.get("JASMINE_LICENSE_PRIVATE_KEY_FILE", "").strip()
        if path and os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                pem = f.read()
    if not pem:
        raise SystemExit(
            "Private key not found. Set JASMINE_LICENSE_PRIVATE_KEY (GitHub secret) "
            "or JASMINE_LICENSE_PRIVATE_KEY_FILE."
        )
    return serialization.load_pem_private_key(pem.encode("utf-8"), password=None)


def generate_license_key(device_id: str) -> str:
    cleaned = device_id.strip().upper()
    if not cleaned:
        raise ValueError("Device ID cannot be empty.")
    signature = _load_private_key().sign(cleaned.encode("utf-8"), ec.ECDSA(hashes.SHA256()))
    b32 = base64.b32encode(signature).decode("ascii").rstrip("=")
    groups = [b32[i:i + 5] for i in range(0, len(b32), 5)]
    return PREFIX + "-" + "-".join(groups)


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 generate_license.py <CUSTOMER_DEVICE_ID>")
        sys.exit(1)

    device_id = sys.argv[1].strip()
    key = generate_license_key(device_id)

    print("==================================================")
    print("          JASMINE PRO LIFETIME LICENSE KEY         ")
    print("==================================================")
    print(f"Customer Device ID : {device_id.upper()}")
    print(f"Generated Key      : {key}")
    print("==================================================")
    print("\nCopy & give this key to your customer:")
    print(key)

    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_path and os.path.exists(os.path.dirname(summary_path) or "."):
        with open(summary_path, "a", encoding="utf-8") as f:
            f.write("## Jasmine Pro License Key\n\n")
            f.write(f"```text\n{key}\n```\n\n")
            f.write(f"Customer Device ID: `{device_id.upper()}`\n")


if __name__ == "__main__":
    main()
