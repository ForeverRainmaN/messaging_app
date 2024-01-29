import Button from "@/components/ui/Button"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

const Page = async ({}) => {
  const session = await getServerSession(authOptions)

  return <pre>{JSON.stringify(session)}</pre>

  return <Button>Hello</Button>
}

export default Page
