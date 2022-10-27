package kr.uracle.smile.support.mybatis;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Min;

/**
 * Paging 요청 클래스
 */
@ApiModel
public class PageRequest {

    @ApiModelProperty(notes = "페이지", position = 90, example = "1")
    @Min(value = 1)
    private int page = 1;

    @ApiModelProperty(notes = "페이지 당 목록 수", position = 91, example = "10")
    @Min(value = 1)
    private int size = 10;

    @ApiModelProperty(notes = "페이지 링크 수", position = 92, example = "10")
    @Min(value = 1)
    private int paginationSize;

    public PageRequest() {
    }

    public int getPage() {
        return this.page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    @ApiModelProperty(hidden = true)
    public int getOffset() { return (this.page-1) * getSize(); }

    public int getSize() {
        return this.size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public int getPaginationSize() {
        return paginationSize == 0 ? 10 : paginationSize;
    }

    public void setPaginationSize(int paginationSize) {
        this.paginationSize = paginationSize;
    }
}
