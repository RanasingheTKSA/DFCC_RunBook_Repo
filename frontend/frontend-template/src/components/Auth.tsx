import React, { FC, ReactNode, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

type Props = {
  children: ReactNode
}

const Auth: FC<Props> = ({ children }) => {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState<boolean>(false)

  useEffect(() => {
    handleSession()
  }, [])

  const handleClose = (event: any, reason: any) => {
    if (reason && reason == "backdropClick") return
  }

  const handleSession = () => {
    const user = localStorage.getItem("user")
    if (user != null && user !='') {
      navigate("/user", { replace: true })
    } else {
      navigate("/", { replace: true })
    }
  }

  return <React.Fragment>{children}</React.Fragment>
}

export default Auth
