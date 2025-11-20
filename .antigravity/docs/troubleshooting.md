# フロントエンド表示のトラブルシューティング

## 確認済み事項

✅ すべてのDockerコンテナが正常に起動中
✅ フロントエンドサーバー（Vite）がポート5173で稼働中
✅ curlでHTMLが正常に返される
✅ ブラウザテストで正常に表示される

## アクセス方法

### URL
```
http://localhost:5173
```

### 代替URL（WSLネットワーク経由）
```
http://172.18.0.4:5173
```

## 表示されない場合の対処法

### 1. ブラウザのキャッシュクリア
- **Windows**: Ctrl + Shift + R
- **Mac**: Cmd + Shift + R

### 2. ブラウザのコンソール確認
1. F12キーを押す
2. Consoleタブを開く
3. 赤いエラーメッセージを確認

### 3. 別のブラウザで試す
- Chrome
- Edge
- Firefox

### 4. WSL2のポートフォワーディング確認（Windows）

PowerShellで以下を実行:
```powershell
netsh interface portproxy show all
```

必要に応じてポートフォワーディングを追加:
```powershell
netsh interface portproxy add v4tov4 listenport=5173 listenaddress=0.0.0.0 connectport=5173 connectaddress=172.18.0.4
```

## スクリーンショット

正常に表示された場合の画面:

![フロントエンド画面](file:///C:/Users/admin/.gemini/antigravity/brain/d2a54591-cb6f-42a7-b2c9-a1e470020802/frontend_view_1763571510859.png)

## 次のステップ

上記を試しても表示されない場合は、以下の情報を提供してください:

1. 使用しているOS（Windows 10/11、Mac、Linux）
2. 使用しているブラウザとバージョン
3. ブラウザのコンソールに表示されているエラーメッセージ
4. ページに何が表示されているか（真っ白、エラーメッセージ、接続できない等）
