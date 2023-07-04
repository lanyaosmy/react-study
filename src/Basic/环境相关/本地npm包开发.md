# 本地npm包开发

## 使用软链 npm link

### 在npm包目录下创建一个全局的链接

```shell
npm link  
```

### 在使用的项目目录下

```shell
npm link packageName   
```

### 去除软链

先在使用npm包的项目的文件目录下解除特定的链接

```shell
npm unlink packageName
```

再在npm包所在的文件目录下去除全局链接

```shell
npm unlink 
```

### 查看所有创建的全局链接名称

```shell
npm ls --global --depth 0
```

### vite会预构建，需要在配置文件下加入以下配置才会生效

```json
{
  "optimizeDeps": {
      "exclude": ["packageName"]
  }
}
```

括弧》
ice构建的项目可以这么改build.json

```json
{
  "vite": {
    "optimizeDeps": {
      "exclude": ["packageName"]
    }
  }
}
```
