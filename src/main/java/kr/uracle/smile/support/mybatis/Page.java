package kr.uracle.smile.support.mybatis;

import java.util.*;

/**
 * 페이지 조회 결과
 * @param <T> 결과에 대한 타입
 */
public class Page<T> implements List<T> {

    private List<T> contents;
    private int totalElements;
    private int page;
    private int pageSize;
    private int paginationSize;
    private final List<Integer> pagination = new ArrayList<>();

    public Page() {
        this.contents = new ArrayList<>();
    }

    public Page(List<T> rows, int page, int pageSize, int paginationSize, int totalElements) {
        this.contents = rows;
        this.totalElements = totalElements;
        this.page = page;
        this.pageSize = pageSize;
        this.paginationSize = paginationSize;
    }

    public List<Integer> createPagination() {
        int start = (int) ((Math.floor(((double)((this.getNumber()-1)/this.paginationSize))) * this.paginationSize) + 1);
        int end = start + (this.paginationSize-1) <= this.getTotalPages() ? start + (this.paginationSize-1) : this.getTotalPages();

        for(int i = start; i <= end; i++) {
            pagination.add(i);
        }

        return pagination;
    }

    public int getPageSize() {
        return pageSize;
    }

    public int getPaginationSize() {
        return paginationSize;
    }

    public List<Integer> getPagination() {
        return pagination;
    }

    public int getTotalPages() {
        return (int) Math.ceil(((double)totalElements / (double)pageSize));
    }

    public int getTotalElements() {
        return this.totalElements;
    }

    public int getNumber() {
        return page;
    }

    public int getNumberOfElements() {
        return contents.size();
    }

    public List<T> getContent() {
        return contents;
    }

    public boolean hasContent() {
        return contents.size() > 0;
    }

    public boolean isFirst() {
        return page == 1;
    }

    public boolean isLast() {
        return page == getTotalPages();
    }

    public boolean hasNext() {
        return page < getTotalPages();
    }

    public boolean hasPrevious() {
        return page > 1;
    }

    public int getSize() {
        return contents.size();
    }


    @Override
    public int size() {
        return contents.size();
    }

    @Override
    public boolean isEmpty() {
        return contents.isEmpty();
    }

    @Override
    public boolean contains(Object o) {
        return contents.contains(o);
    }

    @Override
    public Iterator<T> iterator() {
        return contents.iterator();
    }

    @Override
    public Object[] toArray() {
        return contents.toArray();
    }

    @Override
    public <T1> T1[] toArray(T1[] a) {
        return contents.toArray(a);
    }

    @Override
    public boolean add(T t) {
        return contents.add(t);
    }

    @Override
    public boolean remove(Object o) {
        return contents.remove(o);
    }

    @Override
    public boolean containsAll(Collection<?> c) {
        return contents.containsAll(c);
    }

    @Override
    public boolean addAll(Collection<? extends T> c) {
        return contents.addAll(c);
    }

    @Override
    public boolean addAll(int index, Collection<? extends T> c) {
        return contents.addAll(index, c);
    }

    @Override
    public boolean removeAll(Collection<?> c) {
        return contents.removeAll(c);
    }

    @Override
    public boolean retainAll(Collection<?> c) {
        return contents.retainAll(c);
    }

    @Override
    public void clear() {
        contents.clear();
    }

    @Override
    public T get(int index) {
        return contents.get(index);
    }

    @Override
    public T set(int index, T element) {
        return contents.set(index, element);
    }

    @Override
    public void add(int index, T element) {
        contents.add(index, element);
    }

    @Override
    public T remove(int index) {
        return contents.remove(index);
    }

    @Override
    public int indexOf(Object o) {
        return contents.indexOf(o);
    }

    @Override
    public int lastIndexOf(Object o) {
        return contents.lastIndexOf(o);
    }

    @Override
    public ListIterator<T> listIterator() {
        return contents.listIterator();
    }

    @Override
    public ListIterator<T> listIterator(int index) {
        return contents.listIterator(index);
    }

    @Override
    public List<T> subList(int fromIndex, int toIndex) {
        return contents.subList(fromIndex, toIndex);
    }
}
