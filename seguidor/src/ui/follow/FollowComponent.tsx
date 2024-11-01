"use client"

import { IApplication } from "@/interfaces/seguimiento.interface"
import { motion } from "framer-motion"



const FollowComponent = (application: Partial<IApplication>) => {
  console.log(application);
  return (
    <motion.article className="grid grid-rows-1 h-4 w-auto">

    <h2>pichula</h2>

    </motion.article>
  )
}

export default FollowComponent