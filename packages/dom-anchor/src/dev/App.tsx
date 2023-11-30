import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <p>
        and initialized with null, but it's never assigned any other value in the provided code excerpt. This means that
        its value remains null throughout the execution of the match method. If you want to use textQuoteSelector, you
        need to assign a value to it within the match method or elsewhere in your code. For example, you might want to
        assign a value to it inside the forEach loop, depending on the properties of the s object. Here's a pseudocode
        of what you might want to do:
      </p>
      <p>
        这可能是由于几个原因导致的： 你可能没有在工作空间的根目录下运行 pnpm
        install。这将确保所有的依赖关系都被正确地链接在一起。 你可能没有在 pnpm-workspace.yaml
        文件中包含你的包。这个文件告诉 pnpm 哪些目录应该被视为工作空间的一部分。 你可能在 package.json
        文件中没有列出你的依赖。pnpm 使用这个文件来确定每个包的依赖关系。 你可以尝试以下步骤来解决这个问题：
        在工作空间的根目录下运行 pnpm install。 检查你的 pnpm-workspace.yaml 文件，确保它包含了你的包。 检查你的
        package.json 文件，确保你的依赖已经被列出。 如果以上步骤不能解决问题，你可能需要清除 pnpm
        的缓存并重新安装依赖。你可以通过运行 pnpm store prune 和 pnpm install 来完成这个操作。
        如果问题仍然存在，你可能需要检查你的 TypeScript 配置。确保你的 tsconfig.json 文件中的 paths 和 baseUrl
        设置正确。
      </p>
      <h3>
        Vite <span></span> React
      </h3>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h4>
        Vite <span>++</span> React
      </h4>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>cosu234234nt is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  )
}

export default App
