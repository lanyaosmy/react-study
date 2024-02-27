Model–View–ViewModel(MVVM) 
MVVM的设计思想：关注model数据的变化，让MVVM框架去自动更新DOM的状态，把开发者从操作DOM元素的繁琐工作中解脱出来。

### View 层

View 是视图层，也就是用户界面。前端主要由 HTML 和 CSS 来构建

### ViewModel 层

ViewModel 是由前端开发人员组织生成和维护的视图数据层。在这一层，前端开发者对从后端获取的 Model 数据进行转换处理，做二次封装，以生成符合 View 层使用预期的视图数据模型。

### Model 层

Model 是指数据模型，泛指后端进行的各种业务逻辑处理和数据操控，主要围绕数据库系统展开。