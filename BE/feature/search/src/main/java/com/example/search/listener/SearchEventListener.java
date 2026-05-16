package com.example.search.listener;

import com.example.common.events.search.SearchDeleteEvent;
import com.example.common.events.search.SearchIndexEvent;
import com.example.search.event.ReindexEvent;
import com.example.search.service.GlobalSearchIndexService;
import com.example.search.service.GlobalSearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SearchEventListener {

    private final GlobalSearchIndexService indexService;
    private final GlobalSearchService globalSearchService;

    @Async
    @EventListener
    public void onIndex(SearchIndexEvent event) {
        indexService.index(event);
    }

    @Async
    @EventListener
    public void onDelete(SearchDeleteEvent event) {
        indexService.delete(event.getId());
    }

    @Async
    @EventListener(ReindexEvent.ReindexAllEvent.class)
    public void onReindex() {
        globalSearchService.reindexAll();
    }
}