/*
 * @Author: mikey.zhaopeng 
 * @Date: 2020-03-05 09:36:26 
 * @Last Modified by: xi.kun
 * @Last Modified time: 2020-03-07 11:57:53
 */
const validator = require('validator');

const { isString, isFunction, isArray, get } = require('lodash')
const { ParameterExceptio } = require('../../core/httpException')

class Validator {
    constructor() {
        /**
         * 装载数据的容器
         */
        this.data = {}
        /**
         * 解析后的数据
         */
        this.parsed = {}
        /**
         * 数据校验错误集合
         */
        this.errors = []
    }

    /**
     * 校验函数
     * @param {*} ctx koa context
     * @param {*} alias 别名
     */
    async validate(ctx, alias) {
        this.data = {
            body: ctx.request.body,
            query: ctx.request.query,
            header: ctx.request.header,
            params: ctx.parms
        }
        const hasErr = await this.checkRules()
        if (!hasErr) {
            throw new ParameterExceptio(this.errors)
        } else {
            ctx.v = this
            return this
        }
    }


    async checkRules() {
        // 获取类上的所有 属性和方法
        let keys = Reflect.ownKeys(this)

        // 对属性进行筛选 
        keys = keys.filter(key => {
            const rules = this[key]

            if (isArray(rules)) {
                if (rules.length === 0) {
                    return false
                }
                for (const rule of rules) {
                    if (!rule instanceof Rule) {
                        throw new Error('every rule must be a instance of Rule')
                    }
                }
                return true
            } else {
                return rules instanceof Rule
            }
        })

        if (keys.length === 0) {
            return
        }

        for (const key of keys) {
            // 根据 key 拿到value
            const [field, dataValue] = this._findValueData(key)

            if (!dataValue) {
                this.errors.push({ key: field, msg: '参数必填' })
                return false
            }

            const value = this[key]

            if (isArray(value)) {
                let errs = [];
                for (const it of value) {
                    const valid = await it.validate(dataValue)
                    if (!valid) {
                        errs.push(it.message)
                    }
                }
                if (errs.length) {
                    this.errors.push({ key: field, msg: errs })
                }
            } else {
                let errs = [];
                const valid = await value.validate(dataValue)
                if (!valid) {
                    errs.push(value.message)
                }
                if (errs.length !== 0) {
                    this.errors.push({ key: field, msg: errs })
                }
            }
        }

        // 对 属性函数进行 筛选 
        //validateFuncKeys
        return this.errors.length === 0
    }


    /**
     * 找到传参的值
     * @param {*} field 
     */
    _findValueData(field) {
        const keys = Object.keys(this.data)

        for (const key of keys) {
            const dataValue = get(this.data[key], field)
            if (dataValue !== void 0) {
                return [field, dataValue]
            }
        }
        return [field]
    }
}


class Rule {
    /**
     * 
     * @param {*} validatorFunc 校验类型
     * @param {*} message 错误信息
     * @param  {...any} options 
     */
    constructor(validatorFunc, message, ...options) {
        this.validatorFunc = validatorFunc
        this.message = message || '参数错误'
        this.options = options
    }

    validate(str) {
        //如果是自定义校验
        if (isFunction(this.validatorFunc)) {
            this.validatorFunc(str)
        } else {
            switch (this.validatorFunc) {
                case 'isInt':
                    if (isString(str)) {
                        return validator.isInt(str, this.options)
                    } else {
                        return validator.isInt(String(str), this.options)
                    }
                case 'isFloat':
                    if (isString(str)) {
                        return validator.isFloat(str, this.options)
                    } else {
                        return validator.isFloat(String(str), this.options)
                    }
                case 'isBoolean':
                    if (isString(str)) {
                        return validator.isBoolean(str, this.options)
                    } else {
                        return validator.isBoolean(String(str), this.options)
                    }
                case 'isEmpty':
                    return validator.isEmpty(str, this.options)

                case 'isEmail':
                    return validator.isEmail(str, this.options)

                case 'isIP':
                    return validator.isIP(str, this.options)
                default:
                    return validator[this.validatorFunc](str, ...this.options)
            }
        }
    }
}

module.exports = {
    Validator,
    Rule
} 