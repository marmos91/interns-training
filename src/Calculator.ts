export enum Operation
{
    ADD = 1,
    SUB,
    MUL,
    DIV
}

export class Calculator
{
    private _value;
    private _operation;

    public constructor()
    {
        this._value = 0;
        this._operation = undefined;
    }

    /**
     * Set the new state accoding to operations.
     * @param value Number in input.
     * @throws <i>Error</i> if trying to divide by 0.
     */
    public input(value: number)
    {
        if (!this._operation)
        {
            this._value = value;
            return;
        }

        switch (this._operation)
        {
            case Operation.ADD:
                this._value += value;
                break;
            case Operation.SUB:
                this._value -= value;
                break;
            case Operation.MUL:
                this._value *= value;
                break;
            case Operation.DIV:
                if (value === 0)
                    throw new Error('Cannot divide by 0. Insert a different value.')
                this._value /= value;
                break;
            default:
                throw new Error('Unknown operation.') //NOTE Should never happens.
        }

        this._operation = undefined;
    }

    /**
     * Set the next operation.
     * @param type Operation to perform.
     * @throws <i>Error</i> if an operation is already pending.
     */
    public operation(type: Operation)
    {
        if (this._operation && this._operation !== type)
            throw new Error('Pending operation... Insert a value.')
        this._operation = type;
    }

    /**
     * Get the result.
     * @throws <i>Error</i> if an operation is pending.
     */
    public get result(): number
    {
        if (this._operation)
            throw new Error('Pending operation... Insert a value.')
        return this._value;
    }
}
