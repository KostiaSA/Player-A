// cellRendererFramework нет в файле декларации, исправляем
export interface AgGridColDef extends ag.grid.ColDef {
    cellRendererFramework?: Function;
}



