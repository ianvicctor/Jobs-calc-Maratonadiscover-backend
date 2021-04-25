module.exports = {
    remainingDays(job) {
        //calculo de tempo restante
        const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed() //toFixed arredonda o numero.
    
        const createdDate = new Date(job.created_at)
        const dueDay = createdDate.getDate() + Number(remainingDays) 
        const dueDateInMs = createdDate.setDate(dueDay) //Criando uma nova data
    
        const timeDiffInMs = dueDateInMs - Date.now()
        //transformar millisegundos em dias
        const dayInMs = 1000 * 60 * 60 * 24 
        const dayDiff = Math.floor(timeDiffInMs / dayInMs) //o Math.Floor arredonda para baixo o numero final
    
        //restam x dias
        return dayDiff
    },

    calculateBudget: (job, valueHour) => valueHour * job["total-hours"]
}