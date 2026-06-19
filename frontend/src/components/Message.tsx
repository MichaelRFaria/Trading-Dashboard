export default function Message({type, message}) {

    if (type === "success")
        return <p className="text-green-600">{message}</p>
    else
        return <p className="text-red-600">{message}</p>
}
