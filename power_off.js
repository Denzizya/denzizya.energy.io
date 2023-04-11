class FormEnergyOff
{
    #url = "./inc/controller.php?";
    #arr_options = [['3', 'cityid', 'city', 'answerCity'],
                    ['3', 'PidstanciyID', 'listStanciya','countPidstanciy', 'viewResStanciya', 'namePidstanciy', 'resultPidstanciy'],
                    ['3', 'fiderid', 'listFeeder', 'countFeeder', 'viewResFeeder', 'namefider', 'resultfider'],
                    ['3', 'RPFiderId', 'listRpFeeder', 'countRpFeeder', 'viewResRpFeeder', 'nameRPFider', 'resultRPFider'],
                    ['1', 'Fider2Id', 'listFeederOutRp', 'countFeederOutRp', 'viewResFeederOutRp', 'nameFider2', 'resultFider2'],
                    ['3', 'TPId', 'listTp', 'countTp', 'viewResTp', 'nameTP', 'resultTP'],
                    ['3', 'RpLowVoltageId', 'listRp', 'countRp', 'viewResRp', 'nameRpLowVoltage', 'resultRpLowVoltage'],
                    ['3', 'StreetID', 'street', 'countHome', 'viewResHome', 'nameStreet', 'resultStreet']];

    #arr_form_id = {};
    #id = 0;
    #id_url = false;
    #inputElem;
    #cityid;

    constructor()
    {
        for(let i = 0; i < this.#arr_options.length; i++)
        {
            this.elem(this.#arr_options[i][1]).addEventListener('input', (elem) => {this.searchInput(elem);});
            this.elem(this.#arr_options[i][1]).addEventListener('change', () => {this.save();});
        }
    }

    async searchInput(searchElem)
    {
        const input = this.elem(searchElem.target.id);
        let index = 0;
        this.#arr_options.forEach((elem) => {
            if(elem[1] == searchElem.target.id)
            {
                this.#inputElem = [...elem, index];
                return;
            }
            index++;
        });

        if (input.value.length == this.#inputElem[0])
        {
            let result_api;
            if(this.#id_url)
            {
                this.#arr_form_id = {};
                this.#arr_form_id['cityid'] = this.#cityid;
                this.#arr_form_id['type'] = input.id;
                this.#arr_form_id['name'] = input.value;
                let url_data = JSON.stringify(this.#arr_form_id);
                result_api = await this.getURL("data="+url_data);
            }else{
                result_api = await this.getURL("city="+input.value);
            }
            if(result_api[0])
            {
                let opt = ""; this.elem(this.#inputElem[2]).innerHTML = "";

                for(let key in result_api)
                {
                    let name = result_api[key]['name'];
                    let id = result_api[key]['cityid'];
                    if(result_api[key]['fullpathname']){name = result_api[key]['fullpathname'];}
                    if(result_api[key]['oblelementid']){id = result_api[key]['oblelementid'];}
                    if(result_api[key]['streetid']){id = result_api[key]['streetid'];}
                    opt += `<option data-value="${id}" value="${name}"></option>`;
                }
                this.elem(this.#inputElem[2]).innerHTML += opt;
            }
        }
        
        if(this.#id > 0)
        {
            if(input.value.length > 0)
            {
                this.inputView(true);
            }else{
                this.inputView(false);
            }
        }
    }

    save()
    {
        let sel = this.elem(this.#inputElem[1]).value;
        let option = this.elem(`${this.#inputElem[2]} option[value='${sel}']`);
        if(option)
        {
            this.#id_url = option.dataset.value;
            if(this.#id == 0)
            {
                this.elem(this.#inputElem[1]).remove();
                this.elem(this.#arr_options[0][3]).innerHTML = sel;
                this.inputView(false);
                this.#cityid = this.#id_url;
            }else{
                this.elem(this.#inputElem[1]).setAttribute('disabled', 'disable');
                document.getElementById("off").style.display = 'block';
                document.getElementById("off").addEventListener('click', () => {this.sendOff();});
            }

            this.#arr_form_id['id'] = this.#id_url;
            
            if (!this.#id)
            {
                this.#id++;
            }else if (this.#id == 1){
                this.getResult();
            }
        }
    }

    async getResult()
    {
        this.#arr_form_id['search'] = 'main';
        let url_data = JSON.stringify(this.#arr_form_id);
        let result = await this.getURL("data="+url_data);
        if(result)
        {
            let group_arr = {};
            result.forEach(group => {
                if(!group_arr[group.streetname]){group_arr[group.streetname] = [];}
                group_arr[group.streetname].push([group.guid, group.streetname, group.building]);
            });
            this.divResult(group_arr);
        }
    }

    divResult(data)
    {
        document.getElementById(this.#arr_options[this.#arr_options.length-1][4]).removeAttribute('hidden');
        document.getElementById('causeCase').removeAttribute('hidden');
        let all_address = '', i=0;
        for(let street in data)
        {
            all_address += `<div class="street-link" onClick="form.view('${data[street][0][0]}')">${street}</div><div id="${data[street][0][0]}" style="display: none;">`;
            for(let address in data[street])
            {
                all_address += `<div class="pretty p-svg p-curve" style="display: block; margin: 1em;">
                                    <input type="checkbox" value="${data[street][address][0]}" checked/>
                                    <div class="state p-success">
                                        <svg class="svg svg-icon" viewBox="0 0 20 20">
                                            <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                                        </svg>
                                        <label>${data[street][address][1]+" "+data[street][address][2]}</label>
                                    </div>
                                </div>`;
                i++;
            }
            all_address += '</div>';
        }
        document.getElementById(this.#arr_options[this.#arr_options.length-1][3]).innerHTML = i;
        document.getElementById(this.#arr_options[this.#arr_options.length-1][6]).innerHTML = all_address;
    }

    view(el)
    {
        if(document.getElementById(el).style.display == 'none')
        {
            document.getElementById(el).style.display = 'block';
        }else{
            document.getElementById(el).style.display = 'none';
        }
    }

    elem(id)
    {
        return document.querySelector('#'+id);
    }

    inputView(status)
    {
        if(status)
        {
            for(let i=1; i < this.#arr_options.length; i++)
            {
                if(this.#inputElem[7] == i)continue;
                this.elem(this.#arr_options[(i)][5]).style.display = 'none';
                this.elem(this.#arr_options[(i)][1]).style.display = 'none';
            }
        }else{
            for(let i=1; i < this.#arr_options.length; i++)
            {
                    this.elem(this.#arr_options[(i)][1]).removeAttribute('disabled');
                    this.elem(this.#arr_options[(i)][1]).style.display = 'block';
                    this.elem(this.#arr_options[(i)][5]).style.display = 'block';
                    let city = this.#arr_form_id["region"];
                    this.#arr_form_id["region"] = city;
            }
        }
    }

    async getURL(url)
    {
        return new request().get(url);
    }

    async sendOff()
    {
        let cause_option = document.getElementById('cause').value;
        let cause = false;
        if(cause_option != '')
        {
            cause = document.querySelector('#listCause option[value="'+cause_option+'"]').dataset.value;
        }
        let date = document.getElementById('date').value+"T"+document.getElementById('time').value;
        if(date != 'T')
        {
            date = Date.parse(date);
        }else{
            date = false;
        }

        let data = {}; data['address'] = []; data['cause'] = cause; data['time_end'] = date;

        let all_checkbox = document.querySelectorAll('input[type="checkbox"]');
        all_checkbox.forEach(check => {
            if(check.checked)data['address'].push(check.value);
        })

        if(!data['address'][0] || !data['cause'] || !data['time_end'])
        {
            alert("Вибрані не всі данні!");
            return false;
        }

        let formData = new FormData();
        formData.append('data', JSON.stringify(data));
        formData.append('type', 'off');

        new request().post(formData);
    }
}

let form = new FormEnergyOff();