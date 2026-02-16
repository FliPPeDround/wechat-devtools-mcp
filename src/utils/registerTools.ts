type ToolClass = new (...args: any[]) => any

export function registerToolClasses(
  classes: ToolClass[],
  args: any[],
): void {
  classes.forEach((Constructor) => {
    const instance = new Constructor(...args)
    const methodKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
      .filter(key => key !== 'constructor')
      .filter(key => typeof instance[key] === 'function')
      .filter(key => !key.startsWith('_'))

    methodKeys.forEach((key) => {
      const method = (instance as any)[key]
      try {
        method.call(instance)
      }
      catch (error) {
        console.error(`执行方法 ${key} 时出错:`, error)
      }
    })
  })
}
