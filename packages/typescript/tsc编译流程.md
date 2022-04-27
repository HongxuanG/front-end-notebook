

## tsc的编译流程
源码----> Scanner----> Parser----> Binder----> TypeChecker----> Transformer ----> Emitter

## babel的编译流程
源码----> Parser----> Transformer ----> Generator --->生成目标文件和sourcemap


## 区别
babel并没有对ts做类型检查，不会对ts源码生成类型声明文件`.d.ts`
