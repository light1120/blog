# React 中的一些小技巧

## 当props变化时，重置所有的state

基于react的特性，当组件的key发生变化时，组件状态会重置。在外部引入组件时新增一个key，随着props变化时而变化。

```
export default function ProfilePage({ userId }) {
  return (
    <Profile userId={userId}  key={userId} />
  );
}
function Profile({ userId }) {
  // ✅ 当 key 变化时，该组件内的 comment 或其他 state 会自动被重置
  const [comment, setComment] = useState('');
  // ...
}
```

## 当props变化时，重置部分state

state 有记忆的功能，将 props 用 state 存储。 下次渲染时，将新 prop 跟 state 比较，即可判断是否 props 变化。如果有变化，则更新 state

```
function Profile({ userId }) {
  const [comment, setComment] = useState('');

  const [prevUserId, setPrevUserId] = useState(userId)
  if(userId !== prevUserId){
    setPrevUserId(userId) // 更新userId
    setComment('')
  }
}
```

通过`state`的`记忆`的功能来判断，新旧props是否有变化。 避免使用 useEffect 添加 userId 的依赖项
