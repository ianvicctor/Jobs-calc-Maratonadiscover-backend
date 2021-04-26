const Job = require("../model/job")
const JobUtils = require("../utils/JobUtils")
const Profile = require("../model/Profile")

module.exports = {
  index(req, res) {
    const jobs = Job.get();
    const profile = Profile.get();

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length
    }

    const updatedJobs = jobs.map((job) => {
      //ajustes no job
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      //somando a quantidade de status
      statusCount[status] += 1;

      //cria um array novo e coloca as novas informações: remaining, status e budget
      return {
        ...job, //pega tudo da const jobs e espelha aqui
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"]),
      };
    });

    return res.render("index", { jobs: updatedJobs, profile: profile, statusCount: statusCount });
  },
};
