import os
from PIL import Image

def convert_to_webp(input_path, output_path, quality=85):
    """Convierte una imagen PNG a WebP"""
    try:
        with Image.open(input_path) as img:
            # Convertir a RGB si es necesario (WebP no soporta modo P)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGBA")
            else:
                img = img.convert("RGB")
            img.save(output_path, "WEBP", quality=quality, method=6)
        print(f"✅ {input_path} → {output_path}")
    except Exception as e:
        print(f"❌ Error con {input_path}: {e}")

def main():
    # Raíz del proyecto
    root = "."

    # 1. Logo
    logo_png = os.path.join(root, "logo.png")
    if os.path.exists(logo_png):
        convert_to_webp(logo_png, os.path.join(root, "logo.webp"), quality=85)

    # 2. Banderas (calidad alta, son pequeñas)
    flags_dir = os.path.join(root, "flags")
    if os.path.exists(flags_dir):
        for file in os.listdir(flags_dir):
            if file.lower().endswith(".png"):
                input_path = os.path.join(flags_dir, file)
                output_path = os.path.join(flags_dir, file.replace(".png", ".webp"))
                convert_to_webp(input_path, output_path, quality=90)

    # 3. Portadas de ebooks
    imagenes_dir = os.path.join(root, "imagenes")
    if os.path.exists(imagenes_dir):
        for file in os.listdir(imagenes_dir):
            if file.lower().endswith(".png") or file.lower().endswith(".jpg"):
                input_path = os.path.join(imagenes_dir, file)
                name, ext = os.path.splitext(file)
                output_path = os.path.join(imagenes_dir, name + ".webp")
                convert_to_webp(input_path, output_path, quality=80)

    print("\n✨ ¡Conversión completada! Ahora actualiza tu HTML para usar WebP.")

if __name__ == "__main__":
    main()