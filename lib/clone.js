const toString = ({}).toString

module.exports = function (data) {
    const dataWeakMap = new WeakMap()
    return clone(data)
    function clone(data) {
        if (!data || typeof data !== 'object') {
            return data
        }

        const className = toString.call(data).match(/\[object (\w+)\]/)[1]

        let dataCopy

        switch (className) {
            case 'Array': {
                dataCopy = []
                for (let i = 0, lg = data.length; i < lg; i++) {
                    dataCopy[i] = clone(data[i])
                }
                break
            }
            case 'RegExp': {
                dataCopy = new RegExp(data.source, (data.global ? 'g' : '') + (data.multiline ? 'm' : '') + (data.ignoreCase ? 'i' : ''))
                if (data.lastIndex) dataCopy.lastIndex = data.lastIndex;
                return dataCopy
            }
            case 'Date': {
                return new Date(+data)
            }
            default: {
                const dataCopyYet = dataWeakMap.get(data)
                if (dataCopyYet) {
                    return dataCopyYet
                }

                dataCopy = Object.create(Object.getPrototypeOf(data));
                dataWeakMap.set(data, dataCopy)
                for (const key in data) {
                    if (!data.hasOwnProperty || data.hasOwnProperty(key)) {
                        dataCopy[key] = clone(data[key])
                    }
                }
            }
        }
        return dataCopy
    }
}