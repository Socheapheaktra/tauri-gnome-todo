pkgname=yeeahnis-todo
pkgver=0.1.0
pkgrel=1
pkgdesc="GNOME-inspired desktop task manager"
arch=('x86_64')
url="https://github.com/yeeahnis/gnome-tauri-todo"
license=('custom')
depends=('webkit2gtk-4.1' 'gtk3' 'librsvg')
makedepends=('rust' 'cargo')
source=()
sha256sums=()

build() {
  cd "$startdir"

  source ~/.nvm/nvm.sh
  npm run vite:build
  cd src-tauri
  cargo build --release --features tauri/custom-protocol
}

package() {
  cd "$startdir"

  install -Dm755 "src-tauri/target/release/gnome-tauri-todo" \
    "$pkgdir/usr/bin/gnome-tauri-todo"

  install -Dm644 /dev/stdin "$pkgdir/usr/share/applications/gnome-tauri-todo.desktop" <<'EOF'
[Desktop Entry]
Type=Application
Name=GNOME Tauri TODO
Comment=GNOME-inspired desktop task manager
Exec=gnome-tauri-todo
Icon=gnome-tauri-todo
Terminal=false
Categories=Utility;Office;
Keywords=todo;tasks;productivity;gnome;
StartupNotify=true
EOF

  install -Dm644 "src-tauri/icons/32x32.png" \
    "$pkgdir/usr/share/icons/hicolor/32x32/apps/gnome-tauri-todo.png"
  install -Dm644 "src-tauri/icons/64x64.png" \
    "$pkgdir/usr/share/icons/hicolor/64x64/apps/gnome-tauri-todo.png"
  install -Dm644 "src-tauri/icons/128x128.png" \
    "$pkgdir/usr/share/icons/hicolor/128x128/apps/gnome-tauri-todo.png"
  install -Dm644 "src-tauri/icons/128x128@2x.png" \
    "$pkgdir/usr/share/icons/hicolor/256x256/apps/gnome-tauri-todo.png"
  install -Dm644 "src-tauri/icons/icon.png" \
    "$pkgdir/usr/share/icons/hicolor/512x512/apps/gnome-tauri-todo.png"
}
