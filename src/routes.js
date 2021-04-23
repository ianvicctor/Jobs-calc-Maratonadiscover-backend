const express = require('express');
const routes = express.Router()

const views = __dirname + "/views/"

const Profile = {
    data: {
        name: "Ian Victor",
        avatar: "https://github.com/ianvicctor.png",
        "monthly-budget": 3000,
        "days-per-week": 5,
        "hours-per-day": 5,
        "vacation-per-year": 4,
        "value-hour": 75,
    },

    controllers: {
        index(req, res) {
            return res.render(views + "profile", { profile: Profile.data })
        },

        update(req, res) {
            //req.body para pegar os dados
            const data = req.body

            //definir quantas semanas tem em um ano: 52
            const weeksPerYear = 52

            //remover as semanas de férias do ano, para pegar quantas semanas tem 1 mês
            const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12

            //total de horas trabalhadas na semana
            const weekTotalHours = data["hours-per-day"] * data["days-per-week"]

            //horas trabalhadas no mês
            const monthlyTotalHours = weekTotalHours * weeksPerMonth

            //qual será o valor da horas
            const valueHour = data["value-hour"] = data["monthly-budget"] / monthlyTotalHours

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": valueHour
            }

            return res.redirect('/profile')
        }
    }
}

const Job = {
    data: [
        {
            id: 1,
            name: "Pizzaria Guloso",
            "daily-hours": 2,
            "total-hours": 2,
            created_at: Date.now(),
        },
        {
            id: 2,
            name: "OneTwo Project",
            "daily-hours": 3,
            "total-hours": 47,
            created_at: Date.now(),
        }
    ],
    
    controllers: {
        index(req, res) {
                const updatedJobs = Job.data.map((job) => {
                //ajustes no job
                    const remaining = Job.services.remainingDays(job)
                    const status = remaining <= 0 ? 'done' : 'progress'
            
                    //cria um array novo e coloca as novas informações: remaining, status e budget
                    return {
                        ...job, //pega tudo da const jobs e espelha aqui
                        remaining,
                        status,
                        budget: Profile.data["value-hour"] * job["total-hours"],
                    }
                })
            
                return res.render(views + "index", { jobs: updatedJobs })
        },

        create(req, res) {
            return res.render(views + "job")
        },

        save(req, res) {
            // req.body = {name: 'asdf', 'daily-hours': '3.1', 'total-hours': '3' }
            const lastId = Job.data[Job.data.length - 1]?.id || 1; // Conta quantas posições tem no array, quando achar, coloca o Id dele. Se não achar nenhuma, coloca 1.

        Job.data.push({
            id: lastId + 1,
            name: req.body.name,
            "daily-hours": req.body["daily-hours"],
            "total-hours": req.body["total-hours"],
            created_at: Date.now() // atribuindo data de hoje
        })

        return res.redirect('/')
        },

        show(req, res) {

            const jobId = req.params.id

            const job = Job.data.find(job => job.id === jobId)

            if(!)

            return res.render(views + "job-edit",  { job })
        }
    },

    services: {
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
        }
    },
}

//request (req), response (res)
routes.get('/', Job.controllers.index)
routes.get('/job',  Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/:id', Job.controllers.show)
routes.get('/profile', Profile.controllers.index )
routes.post('/profile', Profile.controllers.update )

module.exports = routes;
