const ApiKey = "c8dc7cc5016f4c4fb545cdb83c557961";
const baseUrl = "http://api.football-data.org/v2/";
const leagueId = "2021";
const baseEndPoin = `${baseUrl}competitions/${leagueId}`;
const teamEndPoin = `${baseUrl}competitions/${leagueId}/teams`;
const standingEndPoin = `${baseUrl}competitions/${leagueId}/standings`;
const matchEndPoin = `${baseUrl}competitions/${leagueId}/matches`;

const contents = document.querySelector("#content-list");
const tittle = document.querySelector(".card-tittle");
const ViewModal = document.querySelector(".modal");

const fetchHeader ={
	headers:{
		'X-Auth-Token' : ApiKey
	}
};

function getListTeams(){
	tittle.innerHTML="Daftar Tim Liga Primer Inggris";
	fetch(teamEndPoin,fetchHeader)
		.then(response => response.json())
		.then(resJson=>{
			console.log(resJson.teams);
			let teams = "";
			resJson.teams.forEach(team=>{
				teams +=`
				<li class="collection-item avatar" style="background-color:#E9B798">
					<img src="${team.crestUrl}" alt="" class="circle">
					<span class="title"><b>${team.name}</b></span>
					<p>Berdiri Tahun : ${team.founded} <br>
					   Tempat Markas : ${team.venue}
					</p>
					<center><a href="#modal1" data-id="${team.id}" class="secondary-content modal-trigger"><i class="material-icons" data-id="${team.id}">info</i><br>Klik Untuk Detail</a></center>
                    </li>
			  </li>
			   `
			});
			contents.innerHTML = `<ul class="collection">`+teams+'</ul>';
			const tombol = document.querySelectorAll('.secondary-content');
			tombol.forEach(button=>{
				 button.onclick=(event) =>{
					showTeamInfo(baseUrl + "teams/" + event.target.dataset.id);
				 }
			})
		}).catch(err=>{
			console.error(err);
		})
}

function showTeamInfo(id){
	fetch(id,fetchHeader)
		.then(response => response.json())
		.then(resJson=>{
			ViewModal.innerHTML= `
				<center>
				<div class="card-image">
                     <img class="responsive-img"  src="${resJson.crestUrl}"  ">
                </div>
                        <div class="modal-content">
                            <h4><b>${resJson.name}</b></h4>
								<p>
								---------------------------------------------------<br>
                                    Negara : ${resJson.area.name}<br>
                                    Markas : ${resJson.venue} <br>
                                    Alamat : ${resJson.address} <br>
                                    No. Telp : ${resJson.phone}<br>
                                    Website : ${resJson.website}<br>
									E-mail : ${resJson.email}<br>
									Berdiri Tahun : ${resJson.founded} <br>
								</p>
								---------------------------------------------------<br>
                        </div>
                        <div class="modal-footer">
                        <a href="#!" class="modal-close waves-effect waves-green btn-flat">TUTUP</a>
						</div>
				</center>
				`
			}).catch(err=>{
				console.error(err);
			})
}

function getListStandings(){
	tittle.innerHTML="Kelasmen Sementara Liga Primer Inggris";
	fetch(standingEndPoin,fetchHeader)
		.then(response => response.json())
		.then(resJson=>{
			console.log(resJson.standings[0]);
			let standings = "";
			let i = 1;
			resJson.standings[0].table.forEach(standing=>{
				standings += `
					<tr>
						<td>${i++}.</td>
						<td><img src="${standing.team.crestUrl}" alt="${standing.team.name}" width="30px"></td>
						<td>${standing.team.name}</td>
						<td>${standing.playedGames}</td>
						<td>${standing.won}</td>
						<td>${standing.draw}</td>
						<td>${standing.lost}</td>
						<td>${standing.points}</td>
					</tr>
			   `
			});
			contents.innerHTML = `
				<div class="card">
					<table class="striped responsive-table centered">
						<thead style="background-color:#D08450">
							<tr>
								<th>NO</th>
								<th>LOGO</th>
								<th>NAMA</th>
								<th>MAIN</th>
								<th>MENANG</th>
								<th>DRAW</th>
								<th>KALAH</th>
								<th>POINTS</th>
							</tr>
						</thead>
						<tbody style="background-color:#E9B798">
							${standings}
						</tbody>
					</table>
				</div>
			`
		}).catch(err=>{
			console.error(err);
		})
}

function getListMatches(){
	tittle.innerHTML="Jadwal Pertandingan Liga Primer Inggris";
	fetch(matchEndPoin,fetchHeader)
		.then(response => response.json())
		.then(resJson=>{
			console.log(resJson.matches);
			let matches = "";
			let i = 1;
			resJson.matches.forEach(match=>{
				let d = new Date (match.utcDate).toLocaleDateString("id");
				let scoreHomeTeam = (match.score.fullTime.homeTeam==null?0:match.score.fullTime.homeTeam);
				let scoreAwayTeam = (match.score.fullTime.awayTeam==null?0:match.score.fullTime.awayTeam);
				matches += `
					<tr>
						<td>${i++}.</td>
						<td>${match.homeTeam.name} vs ${match.awayTeam.name}</td>
						<td>${d}</td>
						<td>${match.status}</td>
						<td>${scoreHomeTeam} : ${scoreAwayTeam}</td>
					</tr>
			   `
			});
			contents.innerHTML = `
				<div class="card">
					<table class="striped responsive-table centered">
						<thead style="background-color:#D08450">
							<tr>
								<th>NO</th>
								<th>NAMA PESERTA</th>
								<th>TANGGAL MAIN</th>
								<th>STATUS</th>
								<th>SCORE</th>
							</tr>
						</thead>
						<tbody style="background-color:#E9B798">
							${matches}
						</tbody>
					</table>
				</div>
			`
		}).catch(err=>{
			console.error(err);
		})
}

function loadPage(page){
	switch(page){
		case "teams":
			getListTeams();
			break;
		case "standings":
			getListStandings();
			break;
		case "matches":
			getListMatches();
			break;
	}
}

document.addEventListener('DOMContentLoaded', function (){
	var elems = document.querySelectorAll('.sidenav');
	var instances = M.Sidenav.init(elems);

	document.querySelectorAll(".sidenav a, .topnav a").forEach(elm=>{
		elm.addEventListener("click", evt=>{
			let sideNav = document.querySelector(".sidenav");
			M.Sidenav.getInstance(sideNav).close();
			page = evt.target.getAttribute("href").substr(1);
			loadPage(page);
		})
	})

	var page = window.location.hash.substr(1);
	if (page === "" || page === "!" ) page = "teams";

	var modal = document.querySelectorAll('.modal');
    M.Modal.init(modal);

	loadPage(page); 
});