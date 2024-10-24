import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { ClientService, Clients } from '@app/api/client.service';
import { FormsComponent } from '@app/pages/page/clients/forms/forms.component';
import { AntTableComponent, AntTableConfig, SortFile } from '@shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType } from '@shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';
import { ModalBtnStatus, ModalWrapService } from '@widget/base-modal';
import { NzBadgeComponent } from 'ng-zorro-antd/badge';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

interface SearchParam {
  ruleName: number;
  desc: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [NzCardComponent, WaterMarkComponent, CardTableWrapComponent, NzBadgeComponent, AntTableComponent, NzIconDirective, NzButtonComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.less'
})
export class ClientsComponent implements OnInit {
  searchParam: Partial<SearchParam> = {};
  @ViewChild('highLightTpl', { static: true }) highLightTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<NzSafeAny>;
  isCollapse = true;
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '查询表格（表头可拖动，点击列表的"查看"按钮，演示在当前tab打开详情操作，如果需要新开tab展示详情，请跳转到"功能>页签操作"中查看演示效果）',
    // desc: '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
    breadcrumb: ['首页', '列表页', '查询表格']
  };
  checkedCashArray: NzSafeAny[] = []; // 需修改为对应业务的数据类型
  dataList: NzSafeAny[] = []; // 需修改为对应业务的数据类型
  destroyRef = inject(DestroyRef);

  private modalSrv = inject(NzModalService);
  private message = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);
  private modalWrapService = inject(ModalWrapService);
  private api = inject(ClientService);

  // 最左侧复选框选中触发
  selectedChecked(e: NzSafeAny): void {
    this.checkedCashArray = [...e];
  }

  // 刷新页面
  reloadTable(): void {
    this.message.info('已经刷新了');
    this.getDataList();
  }

  // 触发表格变更检测
  tableChangeDectction(): void {
    // 改变引用触发变更检测。
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = false;
    this.dataList = [];
    this.api
      .getPage({
        name: '123',
        page: e?.pageIndex,
        size: e?.pageSize
      })
      .subscribe(page => {
        const { content, totalElements, number } = page;
        this.dataList = content;
        this.tableConfig.loading = false;
        this.tableConfig.total = totalElements;
        this.tableConfig.pageSize = totalElements;
      });
    /*-----实际业务请求http接口如下------*/
    // this.tableConfig.loading = true;
    // const params: SearchCommonVO<NzSafeAny> = {
    //   pageSize: this.tableConfig.pageSize!,
    //   pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
    //   filters: this.searchParam
    // };
    // this.dataService.getFireSysList(params).pipe(finalize(() => {
    //   this.tableLoading(false);
    // })).subscribe((data => {
    //   const {list, total, pageNum} = data;
    //   this.dataList = [...list];
    //   this.tableConfig.total = total!;
    //   this.tableConfig.pageIndex = pageNum!;
    //   this.tableLoading(false);
    //   this.checkedCashArray = [...this.checkedCashArray];
    // }));
  }

  /*重置*/
  resetForm(): void {
    this.searchParam = {};
    this.getDataList();
  }

  /*展开*/
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  /*查看*/
  check(id: any): void {
    // skipLocationChange导航时不要把新状态记入历史时设置为true
    // this.router.navigate(['default/page-demo/list/search-table/search-table-detail', name, 123]);
    console.log(id);
    this.api
      .getOne(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.modalWrapService.show<FormsComponent, Clients>(FormsComponent, { nzTitle: '查看', nzDraggable: false, nzOnOk: () => {} }, res).subscribe(res => {});
      });
  }

  add(): void {
    // this.modalService.show({nzTitle: '新增'}).subscribe((res) => {
    //   if (!res || res.status === ModalBtnStatus.Cancel) {
    //     return;
    //   }
    //   this.tableLoading(true);
    //   this.addEditData(res.modalValue, 'addFireSys');
    // }, error => this.tableLoading(false));
    this.modalWrapService
      .show<FormsComponent, Clients>(FormsComponent, {
        nzTitle: '新增'
      })
      .subscribe(res => {
        if (!res || res.status === ModalBtnStatus.Cancel) {
          return;
        }
        this.reloadTable();
      });
  }

  // 修改
  edit(id: number, row: any): void {
    // this.dataService.getFireSysDetail(id).subscribe(res => {
    //   this.modalService.show({nzTitle: '编辑'}, res).subscribe(({modalValue, status}) => {
    //     if (status === ModalBtnStatus.Cancel) {
    //       return;
    //     }
    //     modalValue.id = id;
    //     this.tableLoading(true);
    //     this.addEditData(modalValue, 'editFireSys');
    //   }, error => this.tableLoading(false));
    // });
    this.modalWrapService.show<FormsComponent, Clients>(FormsComponent, { nzTitle: '编辑', nzDraggable: false, nzOnOk: () => {} }, row).subscribe(res => {});
  }

  // addEditData(param: FireSysObj, methodName: 'editFireSys' | 'addFireSys'): void {
  //   this.dataService[methodName](param).subscribe(() => {
  //     this.getDataList();
  //   });
  // }

  del(id: string): void {
    this.modalSrv.confirm({
      nzTitle: '确定要删除吗？',
      nzContent: '删除后不可恢复',
      nzOnOk: () => {
        this.tableLoading(true);
        /*注释的是模拟接口调用*/
        this.api.delete(id).subscribe(res => {
          this.getDataList();
          this.tableLoading(false);
        });
      }
    });
  }

  allDel(): void {
    if (this.checkedCashArray.length > 0) {
      this.modalSrv.confirm({
        nzTitle: '确定要删除吗？',
        nzContent: '删除后不可恢复',
        nzOnOk: () => {
          const tempArrays: number[] = [];
          this.checkedCashArray.forEach(item => {
            tempArrays.push(item.id);
          });
          this.tableLoading(true);
          // 注释的是模拟接口的调用
          // this.dataService.delFireSys(tempArrays).subscribe(() => {
          //   if (this.dataList.length === 1) {
          //     this.tableConfig.pageIndex--;
          //   }
          //   this.getDataList();
          //   this.checkedCashArray = [];
          // }, error => this.tableLoading(false));
          setTimeout(() => {
            this.message.info(`id数组(支持分页保存):${JSON.stringify(tempArrays)}`);
            this.getDataList();
            this.checkedCashArray = [];
            this.tableLoading(false);
          }, 1000);
        }
      });
    } else {
      this.message.error('请勾选数据');
      return;
    }
  }

  changeSort(e: SortFile): void {
    this.message.info(`排序字段：${e.fileName},排序为:${e.sortDir}`);
  }

  // 修改一页几条
  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  private initTable(): void {
    /*
     * 注意，这里需要留一列不要设置width，让列表自适应宽度
     *
     * */
    this.tableConfig = {
      headers: [
        {
          title: 'id',
          width: 130,
          field: 'id',
          show: true
        },
        {
          title: 'clientId',
          width: 130,
          field: 'clientId',
          show: true
        },
        {
          title: 'clientName',
          width: 130,
          field: 'clientName',
          show: true
        },
        {
          title: 'clientAuthenticationMethods',
          width: 130,
          field: 'clientAuthenticationMethods',
          show: true
        },
        {
          title: 'authorizationGrantTypes',
          width: 130,
          field: 'authorizationGrantTypes',
          show: true
        },
        {
          title: 'scopes',
          width: 130,
          field: 'scopes',
          show: true
        },
        {
          title: '操作',
          tdTemplate: this.operationTpl,
          width: 120,
          fixed: true,
          fixedDir: 'right'
        }
      ],
      total: 0,
      showCheckbox: true,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  ngOnInit(): void {
    this.initTable();
  }
}
