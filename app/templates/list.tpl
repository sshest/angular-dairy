 <div class="span12">
    <div class="row w-title-h">
        <h1 class="title-h">Список событий</h1>
    </div>
   <div class="row">
    <table class="table table-hover table-striped">
        <thead>
            <tr>
                <th>Дата</th><th>Название</th><th>Отношение</th><th></th>
            </tr>
            <tr ng-repeat="issue in issues">
                <td>{{issue.data}}</td>
                <td>{{issue.title}}</td>
                <td>{{issue.attitude}}</td>
                <td style="text-align:  center;">
                    <button class="btn btn-info edit" href="#"><i class="fa fa-edit"></i></button>
                    <button class="btn btn-danger remove" href="#"><i class="fa fa-remove"></i></button>
                </td>
            </tr>
        </thead>
        <tbody>

        </tbody>
    </table>
    </div>
    
</div>