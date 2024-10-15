import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { resolve } from 'path'

// 当前执行node命令时文件夹的地址(工作目录)
const root = process.cwd()

// 路径查找
function pathResolve(dir: string) {
  return resolve(root, '.', dir)
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],  
	resolve: {
    extensions: ['.js', '.ts', '.vue'],
		alias: [
			{
				find: /\@\//,
				replacement: `${pathResolve('src')}/`
			}
		]
  },  
	server: {
    port: 3000,
		hmr: {
			overlay: false,
		}
  },
  build: {
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
			},
		},
	},
});
